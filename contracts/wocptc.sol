// SPDX-License-Identifier: MIT

//SAV#8
pragma solidity >=0.8.4 <=0.8.15;

import "./openzeppelin/ERC20.sol";
import "./openzeppelin/Ownable.sol";
import "./openzeppelin/Pausable.sol";

/**
 * WOCPTC is based on ERC20 standart functionality
 * but it has some additional features:
 * ✅ Ownable, i.e. contract has owner how allowed to run some particular featuers
 * ✅ Pausable, i.e Owner can pause all transfers for some time
 * ✅ Mintable, i.e. Owner can enable/disable mint function and mint additional coins
 * ✅ Burnable, i.e. accounts can burn tokens
 * ✅ Votable, i.e. accounts can delegate their voice to somebody and Owner can receive current Voiting Power of
 */

struct AddressBalance {
    address addr;
    uint256 balance;
    bool updateflag;
}

contract WOCPTC is ERC20, Ownable, Pausable {
    AddressBalance[] internal _snapshot;
    uint256 internal _snapshotBlock;
    event Vote(address indexed owner, uint256 question, uint256 answer);

    constructor() ERC20("WOC Platinum Coin", "WOCPTC") Ownable() Pausable() {
        _mint(_msgSender(), 21000000 * 10**decimals());
    }

    function setPause(bool pause_flag) public onlyOwner {
        if (pause_flag) {
            _pause();
        } else {
            _unpause();
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused(), "Contract paused! Transfer not possible");

        if (balanceOf(to) == 0) {
            _snapshot.push(AddressBalance(to, 0, false));
        }
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._afterTokenTransfer(from, to, amount);

        if (balanceOf(from) == 0) {
            bool retcode;
            uint256 index;
            (retcode, index) = _indexForAddress(from);
            if (retcode) {
                _snapshot[index] = _snapshot[_snapshot.length - 1];
                _snapshot.pop();
            }
        }
    }

    function mint(address to, uint256 amount) public virtual onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public virtual whenNotPaused returns (bool) {
        _burn(_msgSender(), amount);
        return true;
    }

    function burnFrom(address account, uint256 amount)
        public
        virtual
        whenNotPaused
        returns (bool)
    {
        address spender = _msgSender();
        require(
            allowance(account, spender) >= amount,
            "Cannot burnFrom  more than allowed"
        );
        _spendAllowance(account, spender, amount);
        _burn(account, amount);
        return true;
    }

    function getSnapshot()
        public
        view
        onlyOwner
        returns (AddressBalance[] memory)
    {
        return (_snapshot);
    }

    function getSnapshotBlock() public view onlyOwner returns (uint256) {
        return (_snapshotBlock);
    }

    function updateSnapshot() public onlyOwner returns (bool) {
        _snapshotBlock = block.number;

        for (uint256 i = 0; i < _snapshot.length; i++) {
            _snapshot[i].balance = balanceOf(_snapshot[i].addr);
            _snapshot[i].updateflag = true;
        }
        return (true);
    }

    function vote(uint256 _question, uint256 _answer) public {
        emit Vote(msg.sender, _question, _answer);
    }

    function _indexForAddress(address theAddress)
        private
        view
        returns (bool, uint256)
    {
        for (uint256 i = 0; i < _snapshot.length; i++) {
            if (_snapshot[i].addr == theAddress) {
                return (true, i);
            }
        }
        return (false, 0);
    }
}
