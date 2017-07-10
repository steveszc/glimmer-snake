import divide from './helper';

const { module, test } = QUnit;

module('Helper: divide', function(hooks) {
  test('it computes', function(assert) {
    assert.equal(divide([1, 2]), 0, 'rounds down a fraction');
    assert.equal(divide([15, 3]), 5, 'divides ints');
    assert.equal(divide([2, 0]), 0, 'handles divide by 0');
    assert.equal(divide(['4', 2]), 2, 'handles dividint string ints');
  });
});
