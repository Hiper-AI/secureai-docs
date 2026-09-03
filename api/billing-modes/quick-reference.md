---
title: Billing Modes Quick Reference
---

# Billing Modes Quick Reference

A quick comparison guide for choosing between User Completions and Usage by Model billing modes.

## Quick Comparison

| Feature | User Completions | Usage by Model |
|---------|------------------|----------------|
| **Default Mode** | ✅ Yes | ❌ No |
| **Cost Structure** | Fixed (license quota) | Variable (per token) |
| **User Permission** | Not required | Must be enabled |
| **Cost Tracking** | Completion counts | Token counts + costs |
| **Best For** | Predictable costs | High-volume usage |
| **Fallback Support** | ✅ Yes | ❌ No |

## When to Use Each Mode

### User Completions Mode

**Choose this when:**
- ✅ You want predictable, fixed costs
- ✅ You're within existing license limits
- ✅ You're building internal tools
- ✅ You want to use existing quota allocations
- ✅ You need simple cost management

**Example Use Cases:**
- Internal chatbots
- Development and testing
- Low-volume applications
- Fixed-budget projects

### Usage by Model Mode

**Choose this when:**
- ✅ You need detailed cost tracking
- ✅ You're using expensive models frequently
- ✅ You want to pay only for actual usage
- ✅ You need granular usage analytics
- ✅ You have high-volume requirements

**Example Use Cases:**
- Production applications
- High-volume AI services
- Cost-sensitive projects
- Multi-model applications

## API Usage

When using the external API with billing modes:

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "prompt": "Hello, world!",
    "user_id": "optional-user-id-for-billing"
  }'
```

## Rate Limits

### Default Rate Limits
- **Requests per minute**: 60 (configurable)
- **Requests per hour**: 1,000 (configurable)
- **Daily limits**: 100 requests (configurable)
- **Monthly limits**: 10,000 requests (configurable)

### Billing Mode Specific Limits
- **User Completions**: Based on license quota
- **Usage by Model**: Additional dollar-based limits

## SMLTP Policy Integration

Both billing modes support SMLTP policy enforcement:

| Policy | Description | Use Case |
|--------|-------------|----------|
| `public` | For non-sensitive data | Public-facing applications |
| `internal` | For company data | Internal tools and processes |
| `confidential` | For sensitive information | Restricted access applications |

### SMLTP Configuration Example

```json
{
  "billingMode": "usage-by-model",
  "allowedSMLTPPolicies": ["public", "internal"],
  "enforceSMLTPPolicies": true,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"]
}
```

## Configuration Examples

### User Completions Configuration

```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal"],
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerHour": 1000
  }
}
```

### Usage by Model Configuration

```json
{
  "billingMode": "usage-by-model",
  "dailyLimit": 500,
  "monthlyLimit": 5000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal", "confidential"],
  "rateLimit": {
    "requestsPerMinute": 120,
    "requestsPerHour": 2000
  },
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100.00
  }
}
```

## Error Scenarios

### User Completions Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Completion limit exceeded` | Monthly quota reached | Enable Usage by Model or increase quota |
| `Daily limit exceeded` | Daily limit reached | Wait for reset or increase limit |
| `User not found` | Invalid user ID | Verify user exists |

### Usage by Model Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Usage by Model required` | User doesn't have it enabled | Enable Usage by Model for user |
| `Usage by Model budget exceeded` | Monthly budget reached | Increase dollar limit |
| `Invalid billing mode` | Invalid mode specified | Use `"usage-by-model"` or `"user-completions"` |

## Migration Guide

### From User Completions to Usage by Model

1. **Enable Usage by Model for the user**
   ```bash
   # Admin panel: Users > Edit User > Enable Usage by Model
   ```

2. **Update API key configuration**
   ```json
   {
     "billingMode": "usage-by-model",
     "usageByModel": {
       "enabled": true,
       "dollarLimit": 100.00
     }
   }
   ```

3. **Monitor usage and costs**
   - Track token usage
   - Monitor monthly spending
   - Adjust limits as needed

### From Usage by Model to User Completions

1. **Verify user has sufficient quota**
   - Check license tier
   - Verify monthly limits

2. **Update API key configuration**
   ```json
   {
     "billingMode": "user-completions",
     "dailyLimit": 100,
     "monthlyLimit": 1000
   }
   ```

3. **Monitor completion usage**
   - Track completion counts
   - Ensure fallback behavior works

## Cost Estimation

### User Completions Costs

- **Fixed cost**: Based on license tier
- **No additional charges**: Beyond existing license
- **Predictable**: Same as web interface usage

### Usage by Model Costs

- **Variable cost**: Based on token usage
- **Model-specific pricing**: Different rates per model
- **Example costs**:
  - GPT-5.1: provider pricing applies
  - Claude Sonnet 4.6: provider pricing applies
  - GPT-5 Nano: provider pricing applies

## Monitoring Tips

### User Completions Monitoring

- Track completion counts daily
- Monitor quota consumption
- Set alerts for approaching limits
- Review usage patterns monthly

### Usage by Model Monitoring

- Track token usage and costs
- Monitor monthly spending
- Set dollar limit alerts
- Review cost breakdown by model

## Security Considerations

### Both Modes

- Use IP restrictions for sensitive apps
- Rotate API keys regularly
- Monitor for unusual activity
- Implement proper error handling

### Usage by Model Specific

- Set appropriate dollar limits
- Monitor for cost spikes
- Review model usage patterns
- Track expensive model usage

## Support Resources

### Documentation
- [Billing Modes Overview](../billing-modes.md)
- [Limits & Quotas](/api/limits-and-quotas) - Understand platform limits

### Admin Panel
- **APIs Section**: Create and manage API keys
- **Users Section**: Enable Usage by Model

### Common Issues
1. **Usage by Model not working**: Check user permissions
2. **Quota exceeded**: Enable Usage by Model or increase limits
3. **Cost spikes**: Review model usage and set limits
4. **Authentication errors**: Verify API key and permissions 
