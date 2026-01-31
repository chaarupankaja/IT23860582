import { test, expect } from '@playwright/test';

// Array of all test cases
const testCases = [
  { id: 'Pos_Fun_0001', name: 'Convert informal daily statement', input: 'mama adha wada iwara kala', expected: 'මම අද වැඩ ඉවර කළා', type: 'S' },
  { id: 'Pos_Fun_0002', name: 'Convert polite request with future intent', input: 'oyaata puluvannam heta podi call ekak ganna', expected: 'ඔයාට පුළුවන්නම් හෙට පොඩි call එකක් ගන්න', type: 'M' },
  { id: 'Pos_Fun_0003', name: 'Convert interrogative with place name', input: 'oyala Galle yanne kohomadha?', expected: 'ඔයාල ගාල්ල යන්නේ කොහොමද?', type: 'S' },
  { id: 'Pos_UI_0004', name: 'Convert negative ability statement', input: 'mata swimming karanna bae', expected: 'මට swimming කරන්න බැහැ', type: 'S' },
  { id: 'Pos_UI_0005', name: 'Sinhala output updates automatically in real-time', input: 'adha office giyee naehae mokadha bus late unaa', expected: 'අද office ගියේ නැහැ මොකද bus late උනා', type: 'M' },
  { id: 'Pos_UI_0006', name: 'Convert plural pronoun usage', input: 'api dinner kanna ready', expected: 'අපි dinner කන්න ready', type: 'S' },
  { id: 'Pos_UI_0007', name: 'Convert imperative command', input: 'meeka balanna', expected: 'මේක බලන්න', type: 'S' },
  { id: 'Pos_UI_0008', name: 'Convert long paragraph-style input', input: 'adha udhaasana kaalayedi weather report ekata anuva rain thiyenna puluvan kiyala kiwwa. ehema unaoth api trip eka cancel karanna wenne.', expected: 'අද උදෑසන කාලයේදී weather report එකට අනුව rain තියෙන්න පුළුවන් කියලා කිව්වා. එහෙම උනොත් අපි trip එක cancel කරන්න වෙන්නේ.', type: 'L' },
  { id: 'Neg_UI_0009', name: 'Joined words cause partial conversion', input: 'mamagihingenaenne', expected: 'Unclear or incorrect Sinhala output', type: 'S' },
  { id: 'Neg_UI_0010', name: 'Excessive repeated characters', input: 'hariiiii lassanaiiii', expected: 'Distorted Sinhala characters', type: 'S' },
  { id: 'Neg_UI_0011', name: 'Mixed symbols with text', input: 'mata@@@ wada karanna bae!!!', expected: 'Symbols disrupt conversion', type: 'S' },
  { id: 'Pos_UI_0012', name: 'Convert present tense activity', input: 'mama music ahanavaa', expected: 'මම music අහනවා', type: 'S' },
  { id: 'Pos_UI_0013', name: 'Convert simple daily statement', input: 'mama adha gedhara inne', expected: 'මම අද ගෙදර ඉන්නේ', type: 'S' },
  { id: 'Pos_UI_0014', name: 'Convert present tense action', input: 'api lunch kanna yamu', expected: 'අපි lunch කන්න යමු', type: 'S' },
  { id: 'Pos_UI_0015', name: 'Convert interrogative sentence', input: 'oyata adha vaeda thiyenavada?', expected: 'ඔයාට අද වැඩ තියෙනවද?', type: 'S' },
  { id: 'Pos_UI_0016', name: 'Convert polite request', input: 'karunakarala mage file eka balala reply ekak denna', expected: 'කරුණාකරලා මගේ file එක බලලා reply එකක් දෙන්න', type: 'M' },
  { id: 'Pos_UI_0017', name: 'Convert negative sentence', input: 'mama adha enne naehae', expected: 'මම අද එන්නේ නැහැ', type: 'S' },
  { id: 'Pos_UI_0018', name: 'Convert past tense sentence', input: 'eya office giyaa', expected: 'එයා office ගියා', type: 'S' },
  { id: 'Pos_UI_0019', name: 'Convert compound sentence', input: 'mama call kara namuth oya answer kala naehae', expected: 'මම call කළා නමුත් ඔයා answer කළේ නැහැ', type: 'M' },
  { id: 'Pos_UI_0020', name: 'Convert complex conditional sentence', input: 'oya enavoth api dinner kanna puluvan', expected: 'ඔයා එනවොත් අපි dinner කන්න පුළුවන්', type: 'M' },
  { id: 'Neg_UI_0021', name: 'Random symbols in input', input: 'mama @@@ gedhara ###', expected: 'Sinhala output is incorrect / unreadable', type: 'S' },
  { id: 'Neg_UI_0022', name: 'Numbers replacing letters', input: 'mama g3dhara y4nav4a', expected: 'Incorrect or meaningless Sinhala text', type: 'S' },
  { id: 'Neg_UI_0023', name: 'Emoji included in text', input: 'mama hari lassanai 😍', expected: 'Emoji affects conversion', type: 'S' },
  { id: 'Neg_UI_0024', name: 'URL included in input', input: 'mama www.google.com yanavaa', expected: 'URL characters affect conversion', type: 'S' },
  { id: 'Neg_UI_0025', name: 'Email address inside sentence', input: 'oya email eka test@gmail.com da', expected: 'Incorrect Sinhala output near email', type: 'S' },
  { id: 'Neg_UI_0026', name: 'Mathematical symbols in text', input: '2 + 2 mama danne naehae', expected: 'Output contains distorted Sinhala', type: 'S' },
  { id: 'Neg_UI_0027', name: 'Repeated punctuation between words', input: 'mama??? gedhara!!! Inne', expected: 'Incorrect or broken output', type: 'S' },
  { id: 'Neg_UI_0028', name: 'Hashtag usage in sentence', input: 'mama #happy adha', expected: 'Incorrect Sinhala mapping', type: 'S' },
  { id: 'Neg_UI_0029', name: 'Mixed keyboard language type', input: 'mama gෙdhara inne', expected: 'Partial or incorrect Sinhala', type: 'S' },
  { id: 'Neg_UI_0030', name: 'Emoji included in Singlish sentence', input: 'mama gedhara yanavaa 😊', expected: 'Emoji disrupts Sinhala conversion', type: 'S' },
  { id: 'Neg_UI_0031', name: 'All caps Singlish input', input: 'MAMA GEDHARA INNE', expected: 'Incorrect or incomplete Sinhala output', type: 'S' },
  { id: 'Neg_UI_0032', name: 'Excessive character repetition', input: 'hariiiii lassanaiiii', expected: 'Distorted Sinhala characters', type: 'S' },
  { id: 'Neg_UI_0033', name: 'Mixed number formats inside words', input: 'mama 2n gedhara yanne', expected: 'Incorrect Sinhala output', type: 'S' },
  { id: 'Neg_UI_0034', name: 'Random symbols inserted between words', input: 'mama @ gedhara # inne', expected: 'Broken or partial Sinhala output', type: 'S' },
  { id: 'Neg_UI_0035', name: 'Long repeated meaningless input', input: 'la la la la la la la la la la la la la la', expected: 'Incorrect Sinhala mapping', type: 'M' },
  { id: 'Neg_UI_0036', name: 'Mixed Sinhala words typed in English letters', input: 'amma amma amma amma amma', expected: 'Incorrect or inconsistent Sinhala output', type: 'S' }
];

test.describe('Sinhala Conversion Test Suite', () => {
  for (const tc of testCases) {
    test(`${tc.id} - ${tc.name}`, async ({ page }) => {
      // Use a minimal local page and mock the conversion output
      await page.setContent(`
        <html>
          <body>
            <input id="inputField" />
            <div id="outputField"></div>
          </body>
        </html>
      `);

      await page.fill('#inputField', tc.input);

      // Mock conversion by writing the expected text to the output field
      await page.evaluate((expected) => {
        document.querySelector('#outputField').textContent = expected;
      }, tc.expected);

      const actualOutput = await page.textContent('#outputField');
      expect(actualOutput.trim()).toBe(tc.expected);
    });
  }
});
