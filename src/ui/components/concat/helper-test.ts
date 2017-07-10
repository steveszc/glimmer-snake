import concat from './helper';

const { module, test } = QUnit;

module('Helper: concat', function(hooks) {
  test('it computes', function(assert) {
    assert.equal(concat(['a', 'b']), 'ab');
  });
});
