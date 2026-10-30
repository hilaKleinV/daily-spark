export interface WritingTask {
  id: number;
  type: 'word-prompt' | 'first-line' | 'poetry' | 'dialogue' | 'description';
  title: string;
  instruction: string;
  prompt: string;
}

const WORD_PROMPTS = [
  'זיכרון', 'חלום', 'דממה', 'מסע', 'אור', 'צל', 'רוח', 'גשם', 'ים', 'הר',
  'זמן', 'שינוי', 'תקווה', 'געגוע', 'חופש', 'שורשים', 'דרך', 'בית', 'לילה', 'בוקר',
  'סוד', 'מפתח', 'גשר', 'שער', 'חלון', 'מראה', 'צבע', 'מוזיקה', 'שתיקה', 'קול'
];

const FIRST_LINES = [
  'היא פתחה את הדלת ולא האמינה למה שראתה...',
  'הייתי בן עשר כשהבנתי לראשונה ש...',
  'בלילה הזה, הכל היה שונה...',
  'אם הייתי יכולה לחזור אחורה, הייתי...',
  'הדבר הכי מוזר קרה לי היום בבוקר...',
  'יש מקום שאני חוזרת אליו במחשבות שלי...',
  'המילים האחרונות שהיא אמרה היו...',
  'זה התחיל ביום רגיל לחלוטין...',
  'לפעמים אני שואלת את עצמי מה היה קורה אם...',
  'הדבר הכי יפה שראיתי אי פעם היה...'
];

const POETRY_PROMPTS = [
  'כתבי שיר בן 5 שורות על רגע של שלווה',
  'כתבי שיר קצר על צבע האהוב עלייך - מה הוא מעורר בך?',
  'תארי את הבוקר בשלוש שורות, בלי להשתמש במילה "שמש"',
  'כתבי שיר על מקום מהילדות שלך',
  'השתמשי במילים: רוח, זמן, לב - כתבי 4 שורות',
  'כתבי שיר על משהו שאבד לך',
  'תארי רגש בלי לומר את שמו - 5 שורות',
  'כתבי שיר על עונת השנה האהובה עלייך',
  'השלימי: "אני זוכרת..." - כתבי המשך בחרוזים (4 שורות)',
  'כתבי שיר קצר על דבר יומיומי כמו כוס קפה או גשם'
];

const DIALOGUE_PROMPTS = [
  'כתבי שיחה בין שני אנשים שנפגשים אחרי 10 שנים',
  'דמייני שיחה בינך לבין עצמך בגיל 15',
  'כתבי דיאלוג בין שני חפצים בבית שלך',
  'תארי ויכוח על משהו חשוב - מי צודק?',
  'כתבי שיחה בין דמויות מספר או סרט שאת אוהבת'
];

const DESCRIPTION_PROMPTS = [
  'תארי חדר מבלי להגיד מה יש בו - רק איך הוא מרגיש',
  'כתבי תיאור של ארוחה משפחתית - הטעמים, הריחות, האנשים',
  'תארי את הדרך מהבית לעבודה כאילו את רואה אותה בפעם הראשונה',
  'כתבי על רגע של שמחה - מה הרגשת, מה ראית, מה שמעת?',
  'תארי אדם שאת מכירה בלי להגיד מי זה - רק תכונות וזיכרונות'
];

export function getDailyWritingTask(): WritingTask {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

  // Rotate through different types based on day
  const taskType = dayOfYear % 5;

  switch (taskType) {
    case 0: // Word prompt
      const word = WORD_PROMPTS[dayOfYear % WORD_PROMPTS.length];
      return {
        id: dayOfYear,
        type: 'word-prompt',
        title: 'כתיבה חופשית',
        instruction: 'כתבי 5 שורות או יותר על המילה:',
        prompt: word
      };

    case 1: // Poetry
      const poetryPrompt = POETRY_PROMPTS[dayOfYear % POETRY_PROMPTS.length];
      return {
        id: dayOfYear,
        type: 'poetry',
        title: 'תרגיל שירה',
        instruction: poetryPrompt,
        prompt: ''
      };

    case 2: // First line
      const firstLine = FIRST_LINES[dayOfYear % FIRST_LINES.length];
      return {
        id: dayOfYear,
        type: 'first-line',
        title: 'המשיכי את הסיפור',
        instruction: 'התחילו לך עם המשפט הזה, עכשיו את ממשיכה:',
        prompt: firstLine
      };

    case 3: // Dialogue
      const dialoguePrompt = DIALOGUE_PROMPTS[dayOfYear % DIALOGUE_PROMPTS.length];
      return {
        id: dayOfYear,
        type: 'dialogue',
        title: 'דיאלוג',
        instruction: dialoguePrompt,
        prompt: ''
      };

    case 4: // Description
      const descPrompt = DESCRIPTION_PROMPTS[dayOfYear % DESCRIPTION_PROMPTS.length];
      return {
        id: dayOfYear,
        type: 'description',
        title: 'תיאור',
        instruction: descPrompt,
        prompt: ''
      };

    default:
      return getDailyWritingTask();
  }
}
