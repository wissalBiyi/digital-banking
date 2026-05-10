package org.sid.ebanking_backend.exception;

public class BankAccountNotFoundException extends  Exception {
    public BankAccountNotFoundException(String message) {
        super(message);
    }
}
