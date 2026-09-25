import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const footer = readFileSync(new URL('../app/components/Footer.tsx', import.meta.url), 'utf8')
test('Vision keeps the Constellation with four exact outbound sites', () => {
  const vision = footer.slice(footer.indexOf("t('footer.vision'"), footer.indexOf('</div>', footer.indexOf("t('footer.vision'")))
  assert.match(vision, /Constellation/)
  for (const domain of ['www.hakanhisim.com', 'www.universal-transmissions.com', 'codexoracle.org', 'shop.hakanhisim.com']) {
    assert.match(vision, new RegExp(`href="https://${domain.replaceAll('.', '\\.')}(?:/)?"`))
  }
})
