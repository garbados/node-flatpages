/* global describe, it, beforeEach, afterEach */

const assert = require('assert')
const fsMock = require('mock-fs')

const flatpages = require('./lib')

describe('flatpages', () => {
  beforeEach(() => {
    fsMock({
      entries: {
        'hello.md': '# wow',
        'advanced.md': 'title: Hello, world!\n\n# omg wat\n',
        'wrong.png': 'no thank you',
        drafts: {
          'shitpost.md': 'cw: i can\'t believe it\'s $CURRENT_YEAR and\n\ni haven\'t got my $PUNCHLINE'
        }
      }
    })
  })

  afterEach(() => {
    fsMock.restore()
  })

  it('should process entries', async () => {
    const pages = await flatpages('entries')
    assert.strictEqual(pages['hello.md'].html, '<h1 id="wow">wow</h1>', 'Should process markdown correctly.')
    assert.strictEqual(pages['hello.md'].meta, undefined)
    assert.strictEqual(pages['advanced.md'].meta.title, 'Hello, world!', 'Should process YAML correctly.')
    assert.strictEqual(Object.keys(pages).indexOf('wrong.png'), -1)
    assert(pages.drafts['shitpost.md'].meta.cw)
  })
})
