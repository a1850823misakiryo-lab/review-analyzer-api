// Vercel Serverless Function
// API Route: /api/summarize

// Google AI SDKのライブラリをインポートします
const { GoogleGenerativeAI } = require("@google/generative-ai");

// これが、サーバープログラムの本体です
export default async function handler(request, response) {
  // POSTリクエスト以外は無視します
   if (request.method !== 'POST') {
     return response.status(405).json({ message: 'Only POST requests are allowed' });
   }

   try {
     // 環境変数から、あなたが設定したAPIキーを安全に取得します
     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

     // 拡張機能から送られてきたレビューのテキストを取得します
     const { reviewText } = request.body;

     if (!reviewText) {
       return response.status(400).json({ message: 'Review text is required' });
     }

     // AIに渡す指示（プロンプト）を作成します
     const prompt =
 `以下のAmazonのカスタマーレビュー群を分析し、内容を3〜5個の箇条書きで簡潔に要約してください。レビュワーが感じている最も重要なポイ
 ント（良い点・悪い点）をまとめてください。\n\n---\n\n${reviewText}`;

     // AIに要約を依頼します
       const result = await model.generateContent(prompt);
       const aiResponse = await result.response;
       const summary = aiResponse.text();
  
       // 拡張機能に、AIが生成した要約を返します
       response.status(200).json({ summary: summary });
  
     } catch (error) {
       // エラーが発生した場合
       console.error(error);
       response.status(500).json({ message: 'An error occurred while processing the request.' });
     }
   }
