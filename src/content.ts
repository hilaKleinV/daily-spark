export type RitualId = 'knowledge' | 'piano' | 'writing' | 'meditation'

export interface DailyContent {
  quote: { text: string; author: string }
  knowledge: { category: 'מדע' | 'היסטוריה' | 'פסיכולוגיה'; title: string; fact: string; learnMore: string; image: Img }
  piano: { image: Img }
  meditation: { title: string; blurb: string; minutes: number; pattern: [number, number, number, number]; image: Img }
}

interface Img {
  src: string
  alt: string
}

const photo = (id: string, alt: string): Img => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`,
  alt,
})

const PIANO = photo('1507838153414-b4b713384a76', 'קלידי פסנתר באור רך')
const FOREST = photo('1470071459604-3b5ec3a7fe05', 'יער שקט בערפל')
const COFFEE = photo('1495474472287-4d71bcdd2085', 'כוס קפה על שולחן עץ')
const JOURNAL = photo('1517842645767-c639042777db', 'יומן פתוח ועט')
const CALM = photo('1506126613408-eca07ce68773', 'אדם יושב בהרהור שקט')
const ARCH = photo('1486718448742-163732cd1544', 'אדריכלות מינימליסטית בקווים נקיים')
const OCEAN = photo('1518837695005-2083093ee35b', 'גל רגוע מתגלגל לחוף')
const MEADOW = photo('1500530855697-b586d89ba3ee', 'אחו זהוב בזריחה')
const BOOKS = photo('1481627834876-b7833e8f5570', 'קיר של ספרי ספרייה ישנים')
const EARTH = photo('1446776811953-b23d57bd21aa', 'כדור הארץ מהחלל')
const LIGHT = photo('1441974231531-c6227db76b6e', 'אור שמש בין עצים גבוהים')
const BEACH = photo('1507525428034-b723cf961d3e', 'חוף שקט תחת שמיים חיוורים')
const STARS = photo('1519681393784-d120267933ba', 'הר תחת שמי כוכבים')
const BLOOM = photo('1490750967868-88aa4486c946', 'פרחי גינה רכים')

const search = (q: string) => `https://he.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`

// Index = weekday (0 = Sunday). Seven days, seven small upgrades.
export const WEEK: DailyContent[] = [
  {
    quote: { text: 'כמעט כל דבר יעבוד שוב אם תנתקי אותו מהחשמל לכמה דקות. כולל אותך.', author: 'אן לאמוט' },
    knowledge: {
      category: 'מדע',
      title: 'דבש לא מתקלקל',
      fact: 'ארכאולוגים מצאו בקברים מצריים עתיקים כדי דבש בני יותר מ־3,000 שנה, והדבש עדיין היה ראוי לאכילה. כמות המים הנמוכה בו והחומציות הטבעית שלו כמעט לא מאפשרות לחיידקים לשרוד.',
      learnMore: search('דבש'),
      image: BLOOM,
    },
    piano: { image: PIANO },
    meditation: {
      title: 'נשימת איפוס איטית',
      blurb: 'שאיפה של 4, נשיפה של 6. נשיפה ארוכה אומרת לגוף שמותר לו לנוח.',
      minutes: 3,
      pattern: [4, 0, 6, 0],
      image: CALM,
    },
  },
  {
    quote: { text: 'לא משנה כמה לאט את הולכת, כל עוד את לא עוצרת.', author: 'קונפוציוס' },
    knowledge: {
      category: 'פסיכולוגיה',
      title: 'אפקט זייגרניק',
      fact: 'אנחנו זוכרים משימות לא גמורות טוב יותר ממשימות שהושלמו. הפסיכולוגית בלומה זייגרניק הבחינה שמלצרים זוכרים הזמנות פתוחות בפירוט רב, ושוכחים אותן ברגע שהחשבון שולם. לכן גם התחלה של שתי דקות משאירה את המשימה חיה בראש.',
      learnMore: search('אפקט זייגרניק'),
      image: BOOKS,
    },
    piano: { image: PIANO },
    meditation: {
      title: 'נשימת קופסה לריכוז',
      blurb: 'שאיפה 4, החזקה 4, נשיפה 4, החזקה 4. שיטה שמרגיעה את הראש לפני משהו חשוב.',
      minutes: 5,
      pattern: [4, 4, 4, 4],
      image: FOREST,
    },
  },
  {
    quote: { text: 'מסע של אלף מייל מתחיל בצעד אחד.', author: 'לאו דזה' },
    knowledge: {
      category: 'היסטוריה',
      title: 'קרובה אלינו יותר מאשר לפירמידות',
      fact: 'קליאופטרה חיה קרוב יותר בזמן לנחיתה על הירח מאשר לבניית הפירמידה הגדולה בגיזה. הפירמידה כבר הייתה בת כ־2,500 שנה כשהיא נולדה.',
      learnMore: search('קליאופטרה'),
      image: EARTH,
    },
    piano: { image: PIANO },
    meditation: {
      title: 'נשימה 4-7-8 לערב',
      blurb: 'שאיפה 4, החזקה 7, נשיפה 8. תרגול עדין להרגעת מחשבות עמוסות.',
      minutes: 3,
      pattern: [4, 7, 8, 0],
      image: CALM,
    },
  },
  {
    quote: { text: 'מה שאת עושה כל יום חשוב יותר ממה שאת עושה מדי פעם.', author: "גרצ'ן רובין" },
    knowledge: {
      category: 'מדע',
      title: 'שלושה לבבות, דם כחול',
      fact: 'לתמנון יש שלושה לבבות ודם כחול. שניים מהם שואבים דם לזימים והשלישי מזרים אותו לשאר הגוף. הדם שלו נושא חמצן בעזרת נחושת ולא ברזל, ולכן הוא כחול.',
      learnMore: search('תמנון'),
      image: OCEAN,
    },
    piano: { image: PIANO },
    meditation: {
      title: 'נשימה מאוזנת',
      blurb: 'שאיפה של 5, נשיפה של 5. פשוט, שווה ורגוע מאוד.',
      minutes: 5,
      pattern: [5, 0, 5, 0],
      image: BEACH,
    },
  },
  {
    quote: { text: 'שום דבר לא יכול לעמעם את האור שזורח מבפנים.', author: "מאיה אנג'לו" },
    knowledge: {
      category: 'פסיכולוגיה',
      title: 'כמה זמן לוקח ליצור הרגל?',
      fact: 'מחקר מפורסם מ־University College London מצא שלוקח בממוצע 66 ימים עד שהתנהגות חדשה הופכת לאוטומטית. הטווח היה רחב, בין 18 ל־254 ימים, ופספוס של יום בודד כמעט לא שינה דבר. עקביות מנצחת שלמות.',
      learnMore: search('היווצרות הרגלים'),
      image: LIGHT,
    },
    piano: { image: PIANO },
    meditation: {
      title: 'נשימת קופסה לריכוז',
      blurb: 'שאיפה 4, החזקה 4, נשיפה 4, החזקה 4. שיטה שמרגיעה את הראש לפני משהו חשוב.',
      minutes: 4,
      pattern: [4, 4, 4, 4],
      image: CALM,
    },
  },
  {
    quote: { text: 'אנחנו מה שאנחנו עושים שוב ושוב. מצוינות אינה מעשה, אלא הרגל.', author: 'וויל דיורנט' },
    knowledge: {
      category: 'מדע',
      title: 'המגדל שגדל בקיץ',
      fact: 'מגדל אייפל יכול לגדול בעד 15 סנטימטר בקיץ. הברזל מתרחב בחום, והצד החשוף לשמש אפילו נוטה מעט הרחק ממנה.',
      learnMore: search('מגדל אייפל'),
      image: ARCH,
    },
    piano: { image: PIANO },
    meditation: {
      title: 'נשימת איפוס איטית',
      blurb: 'שאיפה של 4, נשיפה של 6. נשיפה ארוכה אומרת לגוף שמותר לו לנוח.',
      minutes: 3,
      pattern: [4, 0, 6, 0],
      image: FOREST,
    },
  },
  {
    quote: { text: 'במקום שבו המילים נגמרות, המוזיקה מדברת.', author: 'הנס כריסטיאן אנדרסן' },
    knowledge: {
      category: 'היסטוריה',
      title: 'הפסנתר התחיל כ"חלש־חזק"',
      fact: 'הפסנתר הומצא בסביבות 1700 על ידי ברטולומיאו קריסטופורי בפירנצה. הוא קרא לו "צ\'מבלו שמנגן חלש וחזק" (gravicembalo col piano e forte). השם של היום הוא רק הגרסה הקצרה.',
      learnMore: search('פסנתר'),
      image: PIANO,
    },
    piano: { image: PIANO },
    meditation: {
      title: 'נשימה מאוזנת',
      blurb: 'שאיפה של 5, נשיפה של 5. פשוט, שווה ורגוע מאוד.',
      minutes: 5,
      pattern: [5, 0, 5, 0],
      image: CALM,
    },
  },
]

export const contentFor = (d = new Date()) => WEEK[d.getDay()]

type Knowledge = DailyContent['knowledge']
type Meditation = DailyContent['meditation']

const EXTRA_FACTS: Knowledge[] = [
  {
    category: 'מדע',
    title: 'ברק חם יותר מהשמש',
    fact: 'ברק יכול לחמם את האוויר סביבו לכ־30,000 מעלות, פי חמישה בערך מטמפרטורת פני השטח של השמש. החום הפתאומי גורם לאוויר להתפשט במהירות, וזה בדיוק הרעם ששומעים.',
    learnMore: search('ברק'),
    image: STARS,
  },
  {
    category: 'פסיכולוגיה',
    title: 'מוזיקה משחררת דופמין',
    fact: 'מחקר מקנדה מצא שברגעים שבהם מוזיקה מצמררת אותנו, המוח משחרר דופמין, אותו חומר שקשור לתחושת הנאה. מעניין שהוא משתחרר כבר בציפייה לשיא, ולא רק בשיא עצמו.',
    learnMore: search('מוזיקה ומוח'),
    image: PIANO,
  },
  {
    category: 'היסטוריה',
    title: 'אוקספורד ישנה מהאצטקים',
    fact: 'ההוראה באוניברסיטת אוקספורד החלה בסביבות שנת 1096, כמעט 230 שנה לפני שהאצטקים ייסדו את בירתם טנוצ\'טיטלן בשנת 1325.',
    learnMore: search('אוניברסיטת אוקספורד'),
    image: BOOKS,
  },
]

// Playful, abstract writing exercises, written in Hebrew from the start (not translated).
// `prompt` is the thing to write about (a vegetable, a color, a word...); without it the instruction stands alone.
export interface Writing {
  kind: string
  instruction: string
  prompt?: string
  image: Img
}

const WRITING: Writing[] = [
  { kind: 'ירק', instruction: 'כתבי קטע קצר על הירק הזה, כאילו הוא הדמות הראשית בסיפור:', prompt: 'סלק', image: BLOOM },
  { kind: 'צבע', instruction: 'כתבי קטע קצר שמתאר איך נשמע הצבע הזה:', prompt: 'תכלת', image: JOURNAL },
  { kind: 'חיה', instruction: 'כתבי קטע קצר מנקודת המבט של החיה הזאת, ביום ראשון בבוקר:', prompt: 'ינשוף', image: COFFEE },
  { kind: 'רגש', instruction: 'אם הרגש הזה היה חדר בבית, איך הוא היה נראה? כתבי עליו:', prompt: 'התרגשות', image: JOURNAL },
  { kind: 'פרי', instruction: 'כתבי מכתב אהבה לפרי הזה:', prompt: 'אפרסק', image: BLOOM },
  { kind: 'ירק', instruction: 'תארי יום שלם בחיים של הירק הזה, מהרגע שהוא מתעורר ועד הלילה:', prompt: 'גזר', image: COFFEE },
  { kind: 'מילה', instruction: 'כתבי קטע קצר שבו המילה הזאת מופיעה שלוש פעמים, ובכל פעם בהקשר אחר:', prompt: 'פתאום', image: JOURNAL },
  { kind: 'חפץ', instruction: 'כתבי קטע קצר על המפתח הזה, ועל הדלת שהוא פותח:', prompt: 'מפתח קטן וחלוד', image: COFFEE },
  { kind: 'ירק', instruction: 'כתבי קטע קצר על הירק הזה, בלי להזכיר את שמו ובלי להזכיר את הצבע שלו:', prompt: 'בצל', image: BLOOM },
  { kind: 'שיחה', instruction: 'כתבי שיחה בין שתי המילים האלה, שמתווכחות מי מהן חשובה יותר:', prompt: 'עכשיו ואחר כך', image: JOURNAL },
  { kind: 'תבלין', instruction: 'כתבי קטע קצר על התבלין הזה, ועל הארוחה שהוא מציל:', prompt: 'כמון', image: COFFEE },
  { kind: 'פתיחה', instruction: 'תמשיכי מהמשפט הזה לאן שבא לך:', prompt: 'באותו יום, הצבעים התחילו להתנהג אחרת.', image: BLOOM },
  { kind: 'צבע', instruction: 'כתבי קטע קצר שמתחיל במשפט "הצבע הזה הוא בדיוק כמו…":', prompt: 'ירוק זית', image: JOURNAL },
  { kind: 'דמיון', instruction: 'כתבי על גרב בודדה שנשארה אחרי הכביסה. מה קרה לבת הזוג שלה?', image: COFFEE },
  { kind: 'מקום', instruction: 'המציאי עיר קטנה שאף אחד לא שמע עליה. מה יש בה, ומה אסור בה?', image: BLOOM },
  { kind: 'מזג אוויר', instruction: 'כתבי על גשם כאילו הוא אורח שמגיע לבקר בלי להודיע.', image: JOURNAL },
  { kind: 'רגש', instruction: 'כתבי על השקט כאילו הוא מישהו שאת מכירה כבר שנים.', image: COFFEE },
  { kind: 'חיה', instruction: 'כתבי קטע קצר מנקודת המבט של החיה הזאת, ברגע שהיא מגלה שהיא יכולה לעוף:', prompt: 'ארנב', image: BLOOM },
  { kind: 'זמן', instruction: 'מה קורה בשלוש בלילה? כתבי קטע קצר על מקום, אמיתי או מדומיין, בשעה הזאת.', image: JOURNAL },
  { kind: 'שיר קצר', instruction: 'כתבי שלוש שורות על הירח, בלי להשתמש במילים "לילה" ו"אור".', image: COFFEE },
]

// More of the same, so "another exercise" doesn't repeat for a long while. Images cycle through a few calm photos.
const MORE_WRITING_IMAGES = [BLOOM, JOURNAL, COFFEE, LIGHT, BOOKS, MEADOW, FOREST]

const MORE_WRITING: Omit<Writing, 'image'>[] = [
  { kind: 'ירק', instruction: 'תארי את הירק הזה כאילו את מציגה אותו לאנשים שמעולם לא ראו ירקות:', prompt: 'חציל' },
  { kind: 'ירק', instruction: 'כתבי על הירק הזה בסגנון של סרט מתח:', prompt: 'מלפפון' },
  { kind: 'פרי', instruction: 'כתבי על הפרי הזה כאילו הוא זיכרון מהקיץ:', prompt: 'אבטיח' },
  { kind: 'פרי', instruction: 'כתבי קטע קצר על קליפה של הפרי הזה, ומה היא יודעת שאף אחד אחר לא יודע:', prompt: 'תפוז' },
  { kind: 'צבע', instruction: 'איזה ריח יש לצבע הזה? כתבי קטע קצר:', prompt: 'כתום' },
  { kind: 'צבע', instruction: 'אם הצבע הזה היה יום בשבוע, איזה יום הוא היה, ולמה?', prompt: 'סגול' },
  { kind: 'חיה', instruction: 'כתבי מכתב קצר מהחיה הזאת אל בני האדם:', prompt: 'צב' },
  { kind: 'חיה', instruction: 'כתבי קטע קצר על החיה הזאת שמגיעה לעיר גדולה בפעם הראשונה:', prompt: 'שועל' },
  { kind: 'חפץ', instruction: 'כתבי על מטרייה שנשכחה ברכבת. לאן היא רצתה ללכת?' },
  { kind: 'חפץ', instruction: 'כתבי קטע קצר מנקודת המבט של החפץ הזה, שעומד על המדף כבר שנים:', prompt: 'כדור שלג' },
  { kind: 'חפץ', instruction: 'מה היה כתוב בפתק שנמצא בכיס של מעיל ישן? כתבי את הפתק ואת הסיפור שמאחוריו.' },
  { kind: 'חפץ', instruction: 'כתבי על שעון שעומד, ועל מה שהוא מנסה לומר לנו.' },
  { kind: 'אתגר', instruction: 'כתבי שישה משפטים שכל אחד מהם מתחיל באות אחרת, לפי הסדר: א, ב, ג, ד, ה, ו.' },
  { kind: 'מילה', instruction: 'כתבי קטע קצר שנגמר במילה הזאת:', prompt: 'הביתה' },
  { kind: 'מילה', instruction: 'כתבי קטע קצר שמתחיל במילה הזאת:', prompt: 'אולי' },
  { kind: 'מילה', instruction: 'המציאי הגדרה למילה הזאת, כאילו את כותבת מילון משלך:', prompt: 'סבלנות' },
  { kind: 'רגש', instruction: 'איך נראה הפחד כשהוא יושב לידך באוטובוס? כתבי קטע קצר.' },
  { kind: 'רגש', instruction: 'כתבי על שמחה קטנה שהגיעה בלי שום סיבה.' },
  { kind: 'רגש', instruction: 'כתבי על הגעגוע כאילו הוא חפץ שאפשר להחזיק ביד.' },
  { kind: 'מקום', instruction: 'כתבי על חנות קטנה בסמטה שמוכרת רק דבר אחד. מה היא מוכרת?' },
  { kind: 'מקום', instruction: 'כתבי על ספרייה שבה כל ספר מכיל יום אחד מחייו של אדם.' },
  { kind: 'מקום', instruction: 'כתבי על תחנת אוטובוס באמצע שום מקום: מי מחכה בה, ולמי?' },
  { kind: 'מקום', instruction: 'כתבי על גג של בניין בשעת בין הערביים.' },
  { kind: 'זמן', instruction: 'כתבי על הרגע שבין ההתעוררות לבין פתיחת העיניים.' },
  { kind: 'זמן', instruction: 'אם יום שלישי היה אדם, איך הוא היה נראה ומה הוא היה אוכל לארוחת בוקר?' },
  { kind: 'טבע', instruction: 'כתבי על עץ שרואה הכול ומעולם לא אמר מילה.' },
  { kind: 'טבע', instruction: 'כתבי על ענן אחד שהתעכב מאחור, ועל החבורה שהמשיכה בלעדיו.' },
  { kind: 'טבע', instruction: 'כתבי על אבן קטנה בנחל: מה היא ראתה כשהמים עברו עליה?' },
  { kind: 'שיר קצר', instruction: 'כתבי ארבע שורות על כוס תה, בלי להשתמש במילה "חם".' },
  { kind: 'שיר קצר', instruction: 'כתבי שיר של שלוש שורות שכל אחת מהן מתחילה במילה "אולי".' },
  { kind: 'שיר קצר', instruction: 'כתבי שיר קצר על מה שאת רואה עכשיו מהחלון, או על מה שהיית רוצה לראות.' },
  { kind: 'שיחה', instruction: 'כתבי שיחה בין כוס קפה לכוס תה בשעה שהבית ישן.' },
  { kind: 'שיחה', instruction: 'כתבי שיחת טלפון שבה מדברים רק על מזג האוויר, אבל בעצם מדברים על משהו אחר.' },
  { kind: 'שיחה', instruction: 'כתבי שיחה בין עץ לציפור שבנתה בו קן.' },
  { kind: 'פתיחה', instruction: 'תמשיכי מהמשפט הזה:', prompt: 'בקצה הרחוב הייתה דלת שאף אחד לא שם לב אליה קודם.' },
  { kind: 'פתיחה', instruction: 'תמשיכי מהמשפט הזה:', prompt: 'סבתא תמיד אמרה שאסור לדבר עם הים בימי חמישי.' },
  { kind: 'סוף', instruction: 'הנה הסוף של סיפור. כתבי איך הוא התחיל:', prompt: 'ומאז היא לא מפסיקה לחייך כשהיא שומעת פעמון.' },
  { kind: 'דמות', instruction: 'המציאי דמות שאוספת דברים מוזרים, וכתבי על היום שבו היא מצאה את הפריט האחרון באוסף.' },
  { kind: 'דמות', instruction: 'תארי אדם שרואים פעם אחת בחיים, על רציף של תחנת רכבת, לא שוכחים.' },
  { kind: 'דמיון', instruction: 'אם היית יכולה להוסיף יום אחד לשבוע, איך הוא היה נקרא ומה היה קורה בו?' },
]

const ALL_WRITING: Writing[] = [
  ...WRITING,
  ...MORE_WRITING.map((w, i) => ({ ...w, image: MORE_WRITING_IMAGES[i % MORE_WRITING_IMAGES.length] })),
]


// "Draw another" pools. The default pick for today is the item at today's weekday (0 = Sunday).
export const POOLS: { knowledge: Knowledge[]; writing: Writing[]; meditation: Meditation[] } = {
  knowledge: [...WEEK.map((w) => w.knowledge), ...EXTRA_FACTS],
  writing: ALL_WRITING,
  meditation: WEEK.map((w) => w.meditation),
}
