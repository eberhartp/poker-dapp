const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const Token = artifacts.require('Token');

contract('Token', function(accounts) {
    const name = 'Poker Token';
    const symbol = 'POK';
    const decimals = new BN('0');

    const totalSupply = new BN('2000');

    const owner = accounts[0];
    const recipient = accounts[1];
    const spender = accounts[2];

    beforeEach(async function() {
        this.TokenInstance = await Token.new(totalSupply, {from : owner});
    });

    it('has a name', async function() {
        expect(await this.TokenInstance.name()).to.equal(name);
    });

    it('has a symbol', async function() {
        expect(await this.TokenInstance.symbol()).to.equal(symbol);
    });

    it('has a decimal value', async function() {
        expect(await this.TokenInstance.decimals()).to.be.bignumber.equal(decimals);
    });

    it('has expected total supply', async function() {
        expect(await this.TokenInstance.totalSupply()).to.be.bignumber.equal(totalSupply);
    });

    it('owner has total supply', async function() {
        expect(await this.TokenInstance.balanceOf(owner)).to.be.bignumber.equal(totalSupply);
    });

    it('recipient has no token', async function() {
        expect(await this.TokenInstance.balanceOf(recipient)).to.be.bignumber.equal(new BN('0'));
    });

    it('transfers balance from owner to recipient', async function() {
        const transfer = new BN('100');

        let ownerBalanceBefore = await this.TokenInstance.balanceOf(owner);
        let recipientBalanceBefore = await this.TokenInstance.balanceOf(recipient);

        await this.TokenInstance.transfer(recipient, transfer, {from : owner});

        expect(await this.TokenInstance.balanceOf(owner)).to.be.bignumber.equal(ownerBalanceBefore.sub(transfer));
        expect(await this.TokenInstance.balanceOf(recipient)).to.be.bignumber.equal(recipientBalanceBefore.add(transfer));
    });

    it('has approval from owner', async function() {
        const approval = new BN('100');

        await this.TokenInstance.approve(spender, approval, {from : owner});
        expect(await this.TokenInstance.allowance(owner, spender)).to.be.bignumber.equal(approval);
    });

    it('transfers balance from owner to recipient through spender', async function() {
        const allowance = new BN('100');
        const transfer = new BN('20');

        let ownerBalanceBefore = await this.TokenInstance.balanceOf(owner);
        let recipientBalanceBefore = await this.TokenInstance.balanceOf(recipient);

        await this.TokenInstance.approve(spender, allowance, {from : owner});

        await this.TokenInstance.transferFrom(owner, recipient, transfer, {from : spender});

        expect(await this.TokenInstance.balanceOf(owner)).to.be.bignumber.equal(ownerBalanceBefore.sub(transfer));
        expect(await this.TokenInstance.balanceOf(recipient)).to.be.bignumber.equal(recipientBalanceBefore.add(transfer));
    });

    it('lowers allowance from owner to spender after transfer', async function() {
        const allowance = new BN('100');
        const transfer = new BN('20');

        await this.TokenInstance.approve(spender, allowance, {from : owner});

        let spenderAllowanceBefore = await this.TokenInstance.allowance(owner, spender);

        await this.TokenInstance.transferFrom(owner, recipient, transfer, {from : spender});

        expect(await this.TokenInstance.allowance(owner, spender)).to.be.bignumber.equal(spenderAllowanceBefore.sub(transfer));
    });
});