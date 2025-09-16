export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "토픽을 입력하세요." });
  }

  const prompt = `
너는 블로그 글 작성 전문가야. 다음 조건을 반드시 지켜서 글을 작성해야 해.

[조건]
- 최소 5000자 이상 작성 (가능하면 5500~6000자)
- 도입 → 전개 → 정리 흐름 (단, 서론/본론/결론 단어 사용 금지)
- 자연스럽고 친근한 문체, 이모지 활용
- 사례, 비유, 경험담 포함
- SEO 최적화: 주제 키워드를 여러 번 삽입
- 반복적 문장 피하기
- 긍정적으로 마무리하기

[주제] ${topic}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "생성 실패";

    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
