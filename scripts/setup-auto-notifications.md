# Auto-Notifications Edge Function Setup

## What it does

The `auto-notifications` Edge Function automatically generates example notifications for testing purposes. It creates:

- **Financial Tips** (every 3rd hour): Personalized saving suggestions
- **Budget Alerts** (every 3rd hour + 1): Budget usage warnings
- **Goal Reminders** (every 3rd hour + 2): Progress updates for financial goals

## Function Details

- **Function Name**: `auto-notifications`
- **URL**: `https://xrfomcynxqlarazjmkuw.supabase.co/functions/v1/auto-notifications`
- **Deployed**: ✅ Version 2 (Active)

## Scheduling Options

### Option 1: Use cron-job.org (Recommended for testing)
1. Go to [cron-job.org](https://cron-job.org)
2. Create a free account
3. Add a new cron job:
   - **URL**: `https://xrfomcynxqlarazjmkuw.supabase.co/functions/v1/auto-notifications`
   - **Schedule**: `0 * * * *` (every hour)
   - **Method**: POST
   - **Headers**: 
     ```
     Authorization: Bearer YOUR_ANON_KEY
     Content-Type: application/json
     ```

### Option 2: Use GitHub Actions
Create `.github/workflows/auto-notifications.yml`:

```yaml
name: Auto Notifications
on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:  # Manual trigger

jobs:
  send-notifications:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Edge Function
        run: |
          curl -X POST "https://xrfomcynxqlarazjmkuw.supabase.co/functions/v1/auto-notifications" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json"
```

### Option 3: Use Supabase Cron (if available)
If your Supabase plan supports it, you can set up a cron job directly in the Supabase dashboard.

## Manual Testing

To test the function immediately:

```bash
# Using curl
curl -X POST "https://xrfomcynxqlarazjmkuw.supabase.co/functions/v1/auto-notifications" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"

# Using the Supabase CLI
supabase functions invoke auto-notifications --no-verify-jwt
```

## Response Example

```json
{
  "success": true,
  "message": "Created 2 notifications for 3 users",
  "hour": 14,
  "notifications_created": 2,
  "timestamp": "2025-01-17T14:00:00.000Z",
  "users_checked": 3,
  "inserted_ids": ["uuid1", "uuid2"]
}
```

## Features

- **Smart Timing**: Different notification types based on hour of day
- **Randomization**: 70% chance of sending to each user (realistic simulation)
- **User Filtering**: Only sends to confirmed users
- **Batch Insertion**: Efficient database operations
- **CORS Support**: Can be called from web interfaces
- **Error Handling**: Robust error reporting

## Notification Types Generated

### Financial Tips
- Streaming subscription optimization
- Fuel cost savings
- Food deal alerts
- Energy contract optimization
- Mobile plan reviews

### Budget Alerts
- Restaurant spending warnings
- Shopping budget limits
- Food budget progress

### Goal Reminders
- Vacation savings progress
- Emergency fund updates
- Auto down payment tracking

## Monitoring

- Check the Supabase Edge Function logs for execution status
- Monitor the `notifications` table for new entries
- Use the real-time notification system in your app to see notifications appear

## Stopping the Function

To stop automatic notifications:
- Remove the cron job from your chosen scheduling service
- The Edge Function will remain deployed but won't be triggered 