import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Example notification templates
const tipNotifications = [
  {
    type: "tip",
    title: "Streaming-Kosten reduzieren",
    message:
      "Sie haben 3 Streaming-Abos aktiv. Ein Abo-Check könnte bis zu 20€ monatlich sparen.",
    data: {
      category: "Streaming",
      potential_savings: 20,
      suggestion: "abo_review",
    },
  },
  {
    type: "tip",
    title: "Günstigere Tankstelle gefunden",
    message:
      "Es gibt eine Tankstelle 2km entfernt, die 5 Cent günstiger ist. Das spart ca. 3€ pro Tankfüllung.",
    data: {
      category: "Transport",
      potential_savings: 3,
      suggestion: "fuel_location",
    },
  },
  {
    type: "tip",
    title: "Lebensmittel-Angebote nutzen",
    message:
      "Diese Woche sind Ihre häufig gekauften Produkte im Angebot. Potenzielle Ersparnis: 15€.",
    data: {
      category: "Lebensmittel",
      potential_savings: 15,
      suggestion: "weekly_deals",
    },
  },
  {
    type: "tip",
    title: "Energievertrag optimieren",
    message: "Ein Stromtarifwechsel könnte Ihnen jährlich bis zu 240€ sparen.",
    data: {
      category: "Nebenkosten",
      potential_savings: 240,
      suggestion: "energy_switch",
    },
  },
  {
    type: "tip",
    title: "Handy-Tarif überprüfen",
    message:
      "Sie nutzen nur 60% Ihres Datenvolumens. Ein günstigerer Tarif könnte 12€/Monat sparen.",
    data: {
      category: "Kommunikation",
      potential_savings: 12,
      suggestion: "mobile_plan",
    },
  },
];

const budgetAlerts = [
  {
    type: "budget_alert",
    title: "Budget-Warnung: Restaurants",
    message:
      "Sie haben bereits 75% Ihres Restaurant-Budgets diesen Monat verwendet.",
    data: {
      category: "Restaurants",
      percentage: 75,
      budget_amount: 300,
      spent_amount: 225,
    },
  },
  {
    type: "budget_alert",
    title: "Budget fast erreicht: Shopping",
    message:
      "Noch 45€ bis Ihr Shopping-Budget erreicht ist. Seien Sie vorsichtig bei weiteren Käufen.",
    data: {
      category: "Shopping",
      percentage: 85,
      budget_amount: 250,
      spent_amount: 205,
    },
  },
  {
    type: "budget_alert",
    title: "Lebensmittel-Budget auf Kurs",
    message:
      "Sie haben 50% Ihres Lebensmittel-Budgets verwendet. Das ist perfekt für die Monatsmitte!",
    data: {
      category: "Lebensmittel",
      percentage: 50,
      budget_amount: 400,
      spent_amount: 200,
    },
  },
];

const goalReminders = [
  {
    type: "goal_reminder",
    title: "Urlaubsziel in Reichweite",
    message:
      "Noch 2 Monate bis zu Ihrem Urlaubsziel! Sie haben bereits 80% erreicht.",
    data: {
      goal: "Sommerurlaub 2025",
      target_amount: 2500,
      current_amount: 2000,
      completion: 80,
    },
  },
  {
    type: "goal_reminder",
    title: "Notgroschen wächst",
    message: "Ihr Notgroschen ist um 150€ gewachsen. Weiter so!",
    data: {
      goal: "Notgroschen",
      target_amount: 5000,
      current_amount: 3200,
      completion: 64,
    },
  },
  {
    type: "goal_reminder",
    title: "Auto-Anzahlung: Halbzeit",
    message:
      "Sie haben die Hälfte für Ihre Auto-Anzahlung gespart. Noch 1500€ bis zum Ziel.",
    data: {
      goal: "Auto-Anzahlung",
      target_amount: 3000,
      current_amount: 1500,
      completion: 50,
    },
  },
];

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get all active users
    const { data: users, error: usersError } =
      await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error("Users error:", usersError);
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    if (!users || users.users.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No users found to send notifications to",
          notifications_created: 0,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const notifications = [];
    const currentHour = new Date().getHours();
    const timestamp = new Date().toISOString();

    // Generate notifications for each user
    for (const user of users.users) {
      // Only send to confirmed users
      if (!user.email_confirmed_at && !user.phone_confirmed_at) {
        continue;
      }

      // Determine which type of notification to send based on the hour
      let selectedNotification;

      if (currentHour % 3 === 0) {
        // Every 3rd hour: send tips
        selectedNotification =
          tipNotifications[Math.floor(Math.random() * tipNotifications.length)];
      } else if (currentHour % 3 === 1) {
        // Every 3rd hour + 1: send budget alerts
        selectedNotification =
          budgetAlerts[Math.floor(Math.random() * budgetAlerts.length)];
      } else {
        // Every 3rd hour + 2: send goal reminders
        selectedNotification =
          goalReminders[Math.floor(Math.random() * goalReminders.length)];
      }

      // Add some randomization to make it more realistic (70% chance)
      const shouldSend = Math.random() > 0.3;

      if (shouldSend) {
        notifications.push({
          user_id: user.id,
          type: selectedNotification.type,
          title: selectedNotification.title,
          message: selectedNotification.message,
          data: {
            ...selectedNotification.data,
            generated_by: "auto-notifications",
            generated_at: timestamp,
          },
          is_read: false,
        });
      }
    }

    // Insert notifications in batch
    let insertResult = null;
    if (notifications.length > 0) {
      const { data, error } = await supabase
        .from("notifications")
        .insert(notifications)
        .select("id");

      if (error) {
        console.error("Insert error:", error);
        throw new Error(`Failed to insert notifications: ${error.message}`);
      }

      insertResult = data;
      console.log(`Successfully created ${notifications.length} notifications`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Created ${notifications.length} notifications for ${users.users.length} users`,
        hour: currentHour,
        notifications_created: notifications.length,
        timestamp: timestamp,
        users_checked: users.users.length,
        inserted_ids: insertResult?.map((n) => n.id) || [],
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in auto-notifications function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
