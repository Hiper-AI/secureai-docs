---
title: "Billing Mode API Keys"
---



# Billing Mode API Keys

SecureAI supports two distinct billing modes for API keys, allowing administrators to control how usage is tracked and billed for different API integrations.

## Overview

API keys can be configured with one of two billing modes:

- **User Completions**: Deducts from the user's license completion bucket
- **Usage by Model**: Charges to the user's credit card based on actual model usage

## Billing Modes

### User Completions Mode

**Default Mode** - API keys use this mode by default.

#### How it Works
- Deducts completions from the user's monthly license quota
- Uses the same completion limits as the web interface
- No additional charges beyond the user's existing license
- Falls back to Usage by Model if no quota is available and the user has Usage by Model enabled

#### Use Cases
- Internal applications where you want to use existing license allocations
- Development and testing environments
- Applications where you want predictable, fixed costs
- When you want to stay within existing license limits

#### Configuration
```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000
}
```

### Usage by Model Mode

**Advanced Mode** - Requires explicit configuration and user permission.

#### How it Works
- Charges based on actual token usage and model costs
- Tracks input tokens, output tokens, and total tokens
- Calculates costs based on model-specific pricing
- Requires the user to have Usage by Model enabled in their account
- Has configurable monthly dollar limits

#### Use Cases
- High-volume applications where you need precise cost tracking
- Applications using higher-cost models (GPT-5.x, Claude Opus/Sonnet, etc.)
- When you need detailed usage analytics
- Applications where you want to pay only for what you use

#### Configuration
```json
{
  "billingMode": "usage-by-model",
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100
  }
}
```

## API Key Creation

### Creating API Keys with Billing Modes

Create and configure API keys from the SecureAI Admin panel.

1. Go to `Admin -> API Keys`.
2. Create or edit an API key.
3. Set `billingMode` to `user-completions` or `usage-by-model`.
4. Configure limits, allowed models, allowed indexes, and allowed SMLTP policies.

### Billing Mode Validation

The system validates billing mode requirements:

- **Usage by Model Mode**: Requires the user to have Usage by Model enabled
- **User Completions Mode**: Works with any user, but may fall back to Usage by Model if no quota is available

## Usage Tracking

### User Completions Tracking

For User Completions mode, the system tracks:
- Daily and monthly completion counts
- Model-specific usage statistics
- Quota consumption and limits

### Usage by Model Tracking

For Usage by Model mode, the system tracks:
- Input tokens, output tokens, and total tokens
- Model-specific costs and points
- Monthly dollar spending
- Detailed usage analytics

## API Response Examples

### User Completions Mode Response

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

### Usage by Model Mode Response

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18,
    "input_tokens": 10,
    "output_tokens": 8
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

## Error Handling

### Usage by Model Not Enabled

```json
{
  "success": false,
  "error": "Usage by Model required",
  "message": "This API key is configured for Usage by Model billing, but the user does not have Usage by Model enabled. Please contact an administrator to enable Usage by Model for this user.",
  "request_id": "req-abc123"
}
```

### Quota Exceeded (User Completions)

```json
{
  "success": false,
  "error": "Completion limit exceeded",
  "message": "You have reached your monthly Standard completion limit of 1000. To continue using AI models, please contact an administrator to activate Usage by Model in Admin Panel > APIs > Edit.",
  "request_id": "req-abc123"
}
```

### Budget Exceeded (Usage by Model)

```json
{
  "success": false,
  "error": "Usage by Model budget exceeded",
  "message": "You have reached your Usage by Model budget limit of $100.00.",
  "request_id": "req-abc123"
}
```

## Best Practices

### Choosing the Right Billing Mode

1. **Use User Completions when:**
   - You want predictable costs
   - You're within existing license limits
   - You're building internal tools
   - You want to use existing quota allocations

2. **Use Usage by Model when:**
   - You need detailed cost tracking
   - You're using expensive models frequently
   - You want to pay only for actual usage
   - You need granular usage analytics

### Configuration Recommendations

1. **Set appropriate limits:**
   - Daily limits for rate control
   - Monthly limits for cost control
   - Dollar limits for Usage by Model mode

2. **Monitor usage:**
   - Track API key usage regularly
   - Set up alerts for approaching limits
   - Review usage patterns monthly

3. **Security considerations:**
   - Use IP restrictions for sensitive applications
   - Rotate API keys regularly
   - Monitor for unusual usage patterns

## Fallback Mechanism

### User Completions to Usage by Model Fallback

When a User Completions API key encounters quota exhaustion, the system automatically falls back to Usage by Model if:

1. **User has Usage by Model enabled** in their account settings
2. **User has available budget** in their Usage by Model allocation
3. **API key allows fallback** (default behavior)

#### Fallback Process

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [...],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2,
    "billing_fallback": {
      "original_mode": "user-completions",
      "fallback_mode": "usage-by-model",
      "reason": "quota_exhausted"
    }
  }
}
```

### Validation Logic

#### Usage by Model Requirements

The system validates the following before allowing Usage by Model billing:

1. **User Account Settings**: User must have "Usage by Model" enabled
2. **Monthly Budget**: User must have available budget in their allocation
3. **API Key Configuration**: API key must be configured for Usage by Model or allow fallback
4. **Model Access**: User must have access to the requested model

#### Mixed Billing Scenarios

When multiple API keys with different billing modes are used:

- **User Completions keys** consume from the user's monthly quota
- **Usage by Model keys** consume from the user's budget allocation
- **Fallback scenarios** prioritize User Completions first, then Usage by Model
- **Quota exhaustion** triggers automatic fallback if available

## Migration Between Modes

### From User Completions to Usage by Model

1. **Enable Usage by Model**: Ensure the user has Usage by Model enabled in their account
2. **Update API Key**: Change the billing mode in the API key configuration
3. **Set Budget Limits**: Configure appropriate monthly dollar limits
4. **Monitor Usage**: Track both completion usage and budget consumption
5. **Test Fallback**: Verify fallback behavior works correctly

### From Usage by Model to User Completions

1. **Verify Quota**: Ensure the user has sufficient monthly completion quota
2. **Update API Key**: Change the billing mode in the API key configuration
3. **Monitor Usage**: Track completion consumption against monthly limits
4. **Configure Fallback**: Set up fallback to Usage by Model if quota is exhausted
5. **Test Limits**: Verify quota limits are properly enforced

### Migration Best Practices

- **Gradual Migration**: Test with low-volume API keys first
- **Monitor Both Metrics**: Track both completion usage and budget consumption
- **Set Appropriate Limits**: Configure realistic limits for both modes
- **Document Changes**: Keep track of billing mode changes for audit purposes
- **User Communication**: Inform users of billing mode changes and their implications

## Monitoring and Analytics

### Usage Analytics

The system provides detailed analytics for both billing modes:

- **User Completions**: Completion counts, quota usage, model distribution
- **Usage by Model**: Token counts, costs, model-specific analytics

### Admin Panel Integration

The admin panel provides:
- Real-time usage monitoring
- Billing mode configuration
- Usage analytics and reports
- Cost tracking and alerts

## Troubleshooting

### Common Issues

1. **Usage by Model not working:**
   - Verify the user has Usage by Model enabled
   - Check monthly dollar limits
   - Ensure proper model access

2. **User Completions quota issues:**
   - Check user's license tier
   - Verify monthly completion limits
   - Consider enabling Usage by Model as fallback

3. **API key authentication errors:**
   - Verify API key is active
   - Check IP restrictions
   - Ensure proper permissions

### Support

For issues with billing modes:
1. Check the admin panel for usage statistics
2. Review API key configuration
3. Contact system administrator for billing mode changes
4. Monitor logs for detailed error information 
