var flatpages = require('../lib')
var tap = require('tap')
var fsMock = require('mock-fs')

tap.test('flatpages', (group) => {
  group.beforeEach((done) => {
    fsMock({
      'entries': {
        'hello.md': '# wow',
        'advanced.md': 'title: Hello, world!\n\n# omg wat\n',
        'wrong.png': 'no thank you',
        'drafts': {
          'shitpost.md': 'cw: i can\'t believe it\'s $CURRENT_YEAR and\n\ni haven\'t got my $PUNCHLINE'
        }
      }
    })
    done()
  })

  group.afterEach((done) => {
    fsMock.restore()
    done()
  })

  group.test('verify processing', (test) => {
    flatpages('entries')
      .then((pages) => {
        test.equal(pages['hello.md'].html, '<h1 id="wow">wow</h1>', 'Should process markdown correctly.')
        test.equal(pages['hello.md'].meta, undefined)
        test.equal(pages['advanced.md'].meta.title, 'Hello, world!', 'Should process YAML correctly.')
        test.equal(Object.keys(pages).indexOf('wrong.png'), -1)
        test.ok(pages['drafts']['shitpost.md'].meta.cw)
        test.end()
      })
  })

  group.end()
})
