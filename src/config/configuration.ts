export default () => ({
    openai: {
        endpoint: process.env.AZURE_OPENAI_ENDPOINT || "https://<your-resource-name>.openai.azure.com/",
        modelName: process.env.AZURE_OPENAI_MODEL_NAME || "gpt-4o-mini",
        deployment: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini-deployment",
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2023-05-15",
    },
});