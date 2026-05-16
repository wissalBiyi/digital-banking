package org.sid.ebanking_backend.web;

import org.sid.ebanking_backend.dtos.*;
import org.sid.ebanking_backend.exception.BankAccountNotFoundException;
import org.sid.ebanking_backend.services.BankAccountService;
import org.springframework.security.access.prepost.PreAuthorize; // <-- IMPORT SÉCURITÉ OBLIGATOIRE
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class BankAccountRestAPI {
    private final BankAccountService bankAccountService;

    public BankAccountRestAPI(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }

    // USER et ADMIN peuvent consulter un compte spécifique
    @GetMapping("/accounts/{accountId}")
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public BankAccountDTO getBankAccount(@PathVariable String accountId) throws BankAccountNotFoundException {
        return bankAccountService.getBankAccount(accountId);
    }

    // USER et ADMIN peuvent lister tous les comptes
    @GetMapping("/accounts")
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public List<BankAccountDTO> listAccounts() {
        return bankAccountService.bankAccountList();
    }

    // USER et ADMIN peuvent voir l'historique complet des opérations
    @GetMapping("/accounts/{accountId}/operations")
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public List<AccountOperationDTO> getHistory(@PathVariable String accountId) {
        return bankAccountService.accountHistory(accountId);
    }

    // USER et ADMIN peuvent consulter l'historique paginé (utilisé par Angular)
    @GetMapping("/accounts/{accountId}/pageOperations")
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public AccountHistoryDTO getAccountHistory(
            @PathVariable String accountId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) throws BankAccountNotFoundException {
        return bankAccountService.getAccountHistory(accountId, page, size);
    }

    // Seul l'ADMIN peut effectuer un Débit (Retrait)
    @PostMapping("/accounts/debit")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public DebitDTO handleDebit(@RequestBody DebitDTO debitDTO) throws Exception {
        this.bankAccountService.debit(debitDTO.getAccountId(), debitDTO.getAmount(), debitDTO.getDescription());
        return debitDTO;
    }

    // Seul l'ADMIN peut effectuer un Crédit (Versement)
    @PostMapping("/accounts/credit")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public CreditDTO handleCredit(@RequestBody CreditDTO creditDTO) throws Exception {
        this.bankAccountService.credit(creditDTO.getAccountId(), creditDTO.getAmount(), creditDTO.getDescription());
        return creditDTO;
    }

    // Seul l'ADMIN peut effectuer un Virement (Transfert)
    @PostMapping("/accounts/transfer")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void handleTransfer(@RequestBody TransferRequestDTO transferRequestDTO) throws Exception {
        this.bankAccountService.transfer(
                transferRequestDTO.getAccountSource(),
                transferRequestDTO.getAccountDestination(),
                transferRequestDTO.getAmount(),
                transferRequestDTO.getDescription()
        );
    }
}