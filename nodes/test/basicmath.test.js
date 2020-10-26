var expect=require("chai").expect;
var assert=require('assert');

describe("BasicMath",function(){
  describe("BasicAdd",function(){
    var calc1=1+5;
    var calc2=2+6;
    var calc3=3+7;
    var calc4=4+8;

    expect(calc1).to.equal(6);
    expect(calc2).to.equal(8);
    expect(calc3).to.equal(10);
    expect(calc4).to.equal(12);
  })

  describe("BasicSub",function(){
    var calc1=5-1;
    var calc2=6-2;
    var calc3=7-3;
    var calc4=8-4;

    expect(calc1).to.equal(4);
    expect(calc2).to.equal(4);
    expect(calc3).to.equal(4);
    expect(calc4).to.equal(4);
  })

  describe("BasicMulti",function(){
    var calc1=1*5;
    var calc2=2*6;
    var calc3=3*7;
    var calc4=4*8;

    expect(calc1).to.equal(5);
    expect(calc2).to.equal(12);
    expect(calc3).to.equal(21);
    expect(calc4).to.equal(32);
  })

  describe("BasicDivid",function(){
    var calc1=5/1;
    var calc2=6/2;
    var calc3=7/2;
    var calc4=8/4;

    expect(calc1).to.equal(5);
    expect(calc2).to.equal(3);
    expect(calc3).to.equal(3.5);
    expect(calc4).to.equal(2);
  })
})

describe('AddNeg', function(){
  it('It should equal 6', function(){
    assert.strictEqual(6,6)
  })
})
