pragma solidity 0.5.14;

import './SafeMath.sol';


contract Token {
    using SafeMath for uint256;

    string private _name = 'Poker Token';
    string private _symbol = 'POK';
    uint8 private _decimals = 0;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    constructor (uint256 totalSupply) public {
        _totalSupply = totalSupply;
        _balances[msg.sender] = _totalSupply;
    }

    function name() public view returns(string memory) {
        return _name;
    }

    function symbol() public view returns(string memory) {
        return _symbol;
    }

    function decimals() public view returns(uint8) {
        return _decimals;
    }

    function totalSupply() public view returns(uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns(uint256 balance) {
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns(bool success) {
        require(_to != address(0), 'Sending to null address');
        require(_balances[msg.sender] >= _value, 'Insufficiant balance');
        _balances[msg.sender] = _balances[msg.sender].sub(_value);
        _balances[_to] = _balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_allowances[_from][msg.sender] >= _value, 'Insufficient allowance');
        require(_balances[_from] >= _value, 'Insufficient balance');
        _balances[_from] = _balances[_from].sub(_value);
        _balances[_to] = _balances[_to].add(_value);
        emit Transfer(_from, _to, _value);
        _allowances[_from][msg.sender] = _allowances[_from][msg.sender].sub(_value);
        emit Approval(_from, msg.sender, _allowances[_from][msg.sender]);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        require(_spender != address(0), 'Approving to null address');
        _allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return _allowances[_owner][_spender];
    }
}