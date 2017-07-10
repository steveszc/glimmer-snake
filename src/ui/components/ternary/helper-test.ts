import ternary from './helper';

const { module, test } = QUnit;

module('Helper: ternary', function(hooks) {
  test('it computes', function(assert) {
    assert.equal(ternary([true, 1, 2]), 1, 'true condition returns first value');
    assert.equal(ternary([false, 1, 2]), 2, 'true condition returns first value');
  });
});
