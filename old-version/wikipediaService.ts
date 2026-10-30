import type { Spark } from './types';

const HEBREW_WIKI_API = 'https://he.wikipedia.org/w/api.php';

export async function fetchRandomSpark(): Promise<Spark> {
  try {
    // Get a random article from Hebrew Wikipedia
    const randomResponse = await fetch(
      `${HEBREW_WIKI_API}?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*`
    );
    const randomData = await randomResponse.json();
    const pageId = randomData.query.random[0].id;

    // Get the article content, image, and URL
    const contentResponse = await fetch(
      `${HEBREW_WIKI_API}?action=query&format=json&pageids=${pageId}&prop=extracts|categories|pageimages|info&exintro=true&explaintext=true&piprop=original&inprop=url&origin=*`
    );
    const contentData = await contentResponse.json();
    const page = contentData.query.pages[pageId];

    // Determine category based on Wikipedia categories
    const category = determineCategory(page.categories || []);

    // Generate a writing prompt based on the topic
    const prompt = generatePrompt(page.title, category);

    // Get image URL if available
    const imageUrl = page.original?.source;

    // Get Wikipedia URL
    const wikiUrl = page.fullurl;

    return {
      id: pageId,
      category,
      title: page.title,
      content: page.extract || 'תוכן לא זמין',
      prompt,
      imageUrl,
      wikiUrl,
    };
  } catch (error) {
    console.error('Error fetching from Wikipedia:', error);
    // Fallback spark if API fails
    return {
      id: 0,
      category: 'כללי',
      title: 'משהו השתבש',
      content: 'לא הצלחנו לטעון תוכן חדש מוויקיפדיה. נסי שוב מאוחר יותר.',
      prompt: 'מה למדת היום ממקור אחר?',
    };
  }
}

function determineCategory(categories: any[]): string {
  const categoryMap: { [key: string]: string } = {
    'היסטוריה': 'היסטוריה',
    'מדע': 'מדע',
    'ספרות': 'ספרות',
    'אמנות': 'אמנות',
    'מוזיקה': 'מוזיקה',
    'פילוסופיה': 'פילוסופיה',
    'ביולוגיה': 'מדע',
    'פיזיקה': 'מדע',
    'כימיה': 'מדע',
    'גיאוגרפיה': 'גיאוגרפיה',
    'ספורט': 'ספורט',
    'טכנולוגיה': 'טכנולוגיה',
  };

  for (const cat of categories) {
    const title = cat.title.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (title.includes(key.toLowerCase())) {
        return value;
      }
    }
  }

  return 'כללי';
}

function generatePrompt(title: string, category: string): string {
  const prompts: { [key: string]: string[] } = {
    'היסטוריה': [
      `איך לדעתך האירוע הזה השפיע על העולם שלנו היום?`,
      `דמייני שהיית חיה בתקופה הזו - איך החיים שלך היו נראים?`,
      `מה הלקח החשוב ביותר שאפשר ללמוד מהסיפור הזה?`,
    ],
    'מדע': [
      `איך התגלית הזו משנה את ההבנה שלנו על העולם?`,
      `תארי איך הידע הזה יכול לשפר את חיי היומיום שלך.`,
      `מה השאלה הבאה שהיית רוצה לחקור בנושא הזה?`,
    ],
    'ספרות': [
      `מה מושך אותך בסיפור הזה?`,
      `אם היית כותבת על ${title}, מה היית מוסיפה?`,
      `איזה תחושה עולה לך מהקריאה על ${title}?`,
    ],
    'אמנות': [
      `מה היצירה הזו מעוררת בך?`,
      `אילו צבעים או צורות היית משתמשת כדי לייצג את ${title}?`,
      `איך היצירה הזו משקפת את התקופה שבה היא נוצרה?`,
    ],
    'מוזיקה': [
      `איזו מוזיקה מתאימה לפי דעתך לסיפור של ${title}?`,
      `ספרי על זיכרון שקשור אצלך למוזיקה.`,
      `מה ייחודי במוזיקה שלא ניתן להביע בצורות אמנות אחרות?`,
    ],
    'פילוסופיה': [
      `מה דעתך על הרעיון הזה?`,
      `איך המחשבה הזו רלוונטית לחיים המודרניים?`,
      `האם את מסכימה עם הגישה הזו? למה?`,
    ],
  };

  const categoryPrompts = prompts[category] || [
    `מה מעניין אותך ב${title}?`,
    `כתבי על מחשבה שעלתה לך בזמן הקריאה.`,
    `איך הידע הזה מתחבר לחוויות שלך?`,
  ];

  return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
}
