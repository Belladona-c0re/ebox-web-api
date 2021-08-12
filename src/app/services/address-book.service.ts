import { Injectable } from '@angular/core';
import { ContractService } from './contract.service';
import { ToasterService } from './toaster.service';

@Injectable({
    providedIn: 'root'
})
export class AddressBookService {

    collectionKey = 'address-book';

    constructor(
        private contractServ: ContractService,
        private toasterServ: ToasterService) { }

    getAddressesFromLS() {

        let addresses = localStorage.getItem(this.collectionKey);
        if (addresses) {
            return JSON.parse(addresses);
        }
        return [];
    }

    getAddressesMap() {

        let addresses = this.getAddressesFromLS();
        return addresses.reduce((o, e) => (o[e.address] = e.label, o), {});
    }

    addAddress(name, address) {

        let addresses = this.getAddressesFromLS();

        if (!this.checkName(addresses, name) || !this.checkAddress(addresses, address)) {
            return false;
        }

        addresses.push({
            label: name,
            address: address,
            timestamp: Date.now()
        });
        localStorage.setItem(this.collectionKey, JSON.stringify(addresses));
        return addresses;
    }

    removeAddress(address) {

        let addresses = this.getAddressesFromLS();
        let foundId = addresses.findIndex(addr => addr.address == address);
        if (foundId < 0) {
            return false;
        }
        addresses.splice(foundId, 1);
        localStorage.setItem(this.collectionKey, JSON.stringify(addresses));
        return addresses;
    }

    private checkName(addresses, name) {

        if (!/^[a-zA-Z0-9 ]{2,32}$/.test(name)) {

            this.toasterServ.toastMessage$.next({
                type: 'danger',
                message: 'Name must be alphanumeric (spaces allowed), between 2 and 40 characters long',
                duration: 'long'
            });
            return false;
        }

        let found = addresses.find(addr => addr.label == name);
        if (found) {

            this.toasterServ.toastMessage$.next({
                type: 'danger',
                message: `Name already in the list. Please provide a new one.`,
                duration: 'long'
            });
            return false;
        }

        return true;
    }

    private checkAddress(addresses, address) {

        if (!this.contractServ.isValidAddress(address)) {

            this.toasterServ.toastMessage$.next({
                type: 'danger',
                message: 'Address provided is invalid, please retry.',
                duration: 'long'
            });
            return false;
        }

        let found = addresses.find(addr => addr.address == address);
        if (found) {

            this.toasterServ.toastMessage$.next({
                type: 'danger',
                message: `Address already in the list. Please provide a new one.`,
                duration: 'long'
            });
            return false;
        }

        return true;
    }
}
