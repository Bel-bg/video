// i18nDemo.js
// This script demonstrates API internationalization

const videoApi = require("./src/api/videoApi");

// Simple internationalization utility
class I18n {
  constructor() {
    this.translations = {
      en: {
        gettingVideoFeed: "Getting video feed",
        retrievedVideos: "Retrieved {count} videos",
        gettingVideo: "Getting video",
        retrievedVideo: "Retrieved video: {title}",
        likingVideo: "Liking video",
        videoLiked: "Video liked",
        videoUnliked: "Video unliked",
        addingComment: "Adding comment",
        commentAdded: "Comment added",
        uploadingVideo: "Uploading video",
        videoUploaded: "Video uploaded",
        demoCompleted: "Demo completed successfully!",
        demoFailed: "Demo failed",
        error: "Error",
      },
      fr: {
        gettingVideoFeed: "Récupération du flux vidéo",
        retrievedVideos: "{count} vidéos récupérées",
        gettingVideo: "Récupération de la vidéo",
        retrievedVideo: "Vidéo récupérée : {title}",
        likingVideo: "Mise en favori de la vidéo",
        videoLiked: "Vidéo mise en favori",
        videoUnliked: "Vidéo retirée des favoris",
        addingComment: "Ajout d'un commentaire",
        commentAdded: "Commentaire ajouté",
        uploadingVideo: "Téléchargement de la vidéo",
        videoUploaded: "Vidéo téléchargée",
        demoCompleted: "Démo terminée avec succès !",
        demoFailed: "Échec de la démo",
        error: "Erreur",
      },
      es: {
        gettingVideoFeed: "Obteniendo feed de videos",
        retrievedVideos: "{count} videos obtenidos",
        gettingVideo: "Obteniendo video",
        retrievedVideo: "Video obtenido: {title}",
        likingVideo: "Dando me gusta al video",
        videoLiked: "Me gusta agregado",
        videoUnliked: "Me gusta eliminado",
        addingComment: "Agregando comentario",
        commentAdded: "Comentario agregado",
        uploadingVideo: "Subiendo video",
        videoUploaded: "Video subido",
        demoCompleted: "¡Demo completada con éxito!",
        demoFailed: "Demo fallida",
        error: "Error",
      },
    };

    this.currentLanguage = "en";
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      return true;
    }
    return false;
  }

  t(key, params = {}) {
    let translation = this.translations[this.currentLanguage][key] || key;

    // Replace parameters
    for (const [param, value] of Object.entries(params)) {
      translation = translation.replace(`{${param}}`, value);
    }

    return translation;
  }
}

// Internationalized API wrapper
class I18nApi {
  constructor() {
    this.i18n = new I18n();
  }

  setLanguage(lang) {
    return this.i18n.setLanguage(lang);
  }

  async getVideoFeed(limit = 10) {
    console.log(this.i18n.t("gettingVideoFeed"));
    const feed = await videoApi.getVideoFeed(limit);
    console.log(this.i18n.t("retrievedVideos", { count: feed.length }));
    return feed;
  }

  async getVideo(videoId) {
    console.log(this.i18n.t("gettingVideo"));
    const video = await videoApi.getVideo(videoId);
    console.log(this.i18n.t("retrievedVideo", { title: video.title }));
    return video;
  }

  async likeVideo(videoId) {
    console.log(this.i18n.t("likingVideo"));
    const result = await videoApi.likeVideo(videoId);
    console.log(this.i18n.t(result.liked ? "videoLiked" : "videoUnliked"));
    return result;
  }

  async commentOnVideo(videoId, text) {
    console.log(this.i18n.t("addingComment"));
    const result = await videoApi.commentOnVideo(videoId, text);
    console.log(this.i18n.t("commentAdded"));
    return result;
  }

  async uploadVideo(videoData) {
    console.log(this.i18n.t("uploadingVideo"));
    const result = await videoApi.uploadVideo(videoData);
    console.log(this.i18n.t("videoUploaded"));
    return result;
  }
}

async function i18nDemo() {
  try {
    console.log("IG-Live Internationalization Demo");
    console.log("===============================");

    const i18nApi = new I18nApi();

    // 1. English demo
    console.log("\n1. English demo:");
    await runDemoInLanguage(i18nApi, "en");

    // 2. French demo
    console.log("\n2. French demo:");
    await runDemoInLanguage(i18nApi, "fr");

    // 3. Spanish demo
    console.log("\n3. Spanish demo:");
    await runDemoInLanguage(i18nApi, "es");

    console.log("\n🎉 Internationalization demo completed successfully!");
  } catch (error) {
    console.error("❌ Internationalization demo failed:", error.message);
  }
}

async function runDemoInLanguage(i18nApi, language) {
  try {
    i18nApi.setLanguage(language);

    // Get video feed
    const feed = await i18nApi.getVideoFeed(2);

    if (feed.length > 0) {
      const videoId = feed[0].id;

      // Get video
      await i18nApi.getVideo(videoId);

      // Like video
      await i18nApi.likeVideo(videoId);

      // Add comment
      await i18nApi.commentOnVideo(videoId, "I18n demo comment");
    }
  } catch (error) {
    console.error(`  ${i18nApi.i18n.t("demoFailed")}:`, error.message);
  }
}

i18nDemo();
