// keys: extracted from the recovered bundle. See docs/RECOVERY.md.

export var KEY_LEFT = 37,
  KEY_UP = 38,
  KEY_RIGHT = 39,
  KEY_DOWN = 40,
  KEY_OK = 13,
  KEY_BACK = 461,
  KEY_BACKSPACE = 8,
  KEY_ESCAPE = 27,
  KEY_GREEN = 404,
  KEY_YELLOW = 405,
  KEY_BLUE = 406,
  KEY_PLAY = 415,
  KEY_PAUSE = 19,
  KEY_PLAY_PAUSE = 179,
  KEY_STOP = 413,
  KEY_REWIND = 412,
  KEY_FORWARD = 417,
  KEY_CHANNEL_UP = 33,
  KEY_CHANNEL_DOWN = 34,
  DIRECTION_BY_KEY = {
    [KEY_LEFT]: "left",
    [KEY_UP]: "up",
    [KEY_RIGHT]: "right",
    [KEY_DOWN]: "down",
  };

export function isBackKey(e) {
  return e === KEY_BACK || e === KEY_BACKSPACE || e === KEY_ESCAPE;
}

export function isSelectKey(e) {
  return e === KEY_OK;
}

export var DIGITS = "0123456789".split(""),
  ALPHABET = "abcdefghijklmnopqrstuvwxyz".split(""),
  KEYBOARD_LAYOUTS = {
    ar: {
      label: "العربية",
      columns: 10,
      keys: "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي ء أ إ آ ة ى ئ ؤ".split(" "),
    },
    en: {
      label: "English",
      columns: 10,
      keys: ALPHABET,
    },
    es: {
      label: "Español",
      columns: 10,
      keys: ALPHABET.concat("ñ á é í ó ú ü".split(" ")),
    },
    fr: {
      label: "Français",
      columns: 10,
      keys: ALPHABET.concat("à â ç é è ê ë î ï ô ù û".split(" ")),
    },
  },
  Bn = {
    tr: {
      label: "Türkçe",
      columns: 10,
      keys: ALPHABET.concat("ç ğ ı ö ş ü".split(" ")),
    },
    de: {
      label: "Deutsch",
      columns: 10,
      keys: ALPHABET.concat("ä ö ü ß".split(" ")),
    },
    ru: {
      label: "Русский",
      columns: 11,
      keys: "а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я".split(" "),
    },
    pt: {
      label: "Português",
      columns: 10,
      keys: ALPHABET.concat("ã á â à ç é ê í ó ô õ ú".split(" ")),
    },
    it: {
      label: "Italiano",
      columns: 10,
      keys: ALPHABET.concat("à è é ì ò ù".split(" ")),
    },
    hi: {
      label: "हिन्दी",
      columns: 11,
      keys: "अ आ इ ई उ ऊ ए ऐ ओ औ क ख ग घ च छ ज झ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह".split(
        " ",
      ),
    },
  },
  Vn = Object.assign({}, KEYBOARD_LAYOUTS, Bn),
  Wn = [".", "-", "_", ":", "/", "@"];
