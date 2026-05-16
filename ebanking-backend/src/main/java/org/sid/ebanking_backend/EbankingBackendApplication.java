package org.sid.ebanking_backend;

import org.sid.ebanking_backend.dtos.BankAccountDTO;
import org.sid.ebanking_backend.dtos.CurrentBankAccountDTO;
import org.sid.ebanking_backend.dtos.CustomerDTO;
import org.sid.ebanking_backend.dtos.SavingBankAccountDTO;
import org.sid.ebanking_backend.entities.*;
import org.sid.ebanking_backend.enums.AccountStatus;
import org.sid.ebanking_backend.enums.OperationType;
import org.sid.ebanking_backend.exception.BalanceNotSufficientException;
import org.sid.ebanking_backend.exception.BankAccountNotFoundException;
import org.sid.ebanking_backend.exception.CustomerNotFoundException;
import org.sid.ebanking_backend.repositories.AccountOperationRepository;
import org.sid.ebanking_backend.repositories.BankAccountRepository;
import org.sid.ebanking_backend.repositories.CustomerRepository;
import org.sid.ebanking_backend.services.BankAccountService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@SpringBootApplication
public class EbankingBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EbankingBackendApplication.class, args);
	}

	/**
	 * VERSION ACTIVE : Utilise la couche Service (Recommandé)
	 */
	@Bean
	CommandLineRunner commandLineRunner(BankAccountService bankAccountService) {
		return args -> {
			// 1. Création des clients
			Stream.of("Abdo", "Rayan", "Aya").forEach(name -> {
				CustomerDTO customer = new CustomerDTO();
				customer.setName(name);
				customer.setEmail(name + "@gmail.com");
				bankAccountService.saveCustomer(customer);
			});

			// 2. Création des comptes pour chaque client
			bankAccountService.listCustomers().forEach(customer -> {
				try {
					bankAccountService.saveCurrentBankAccount(Math.random() * 90000, 9000, customer.getId());
					bankAccountService.saveSavingBankAccount(Math.random() * 120000, 5.5, customer.getId());
				} catch (CustomerNotFoundException e) {
					e.printStackTrace();
				}
			});

			// 3. Création des opérations pour chaque compte
			List<BankAccountDTO> bankAccounts = bankAccountService.bankAccountList();
			for (BankAccountDTO bankAccount : bankAccounts) {
				for (int i = 0; i < 10; i++) {
					String accountId;
					if (bankAccount instanceof SavingBankAccountDTO) {
						accountId = ((SavingBankAccountDTO) bankAccount).getId();
					} else {
						accountId = ((CurrentBankAccountDTO) bankAccount).getId();
					}
					try {
						bankAccountService.credit(accountId, 10000 + Math.random() * 120000, "Credit");
						bankAccountService.debit(accountId, 1000 + Math.random() * 9000, "Debit");
					} catch (BankAccountNotFoundException | BalanceNotSufficientException e) {
						e.printStackTrace();
					}
				}
			}
		};
	}
	/**
	 * VERSION EN COMMENTAIRE : Utilise les Repositories (Pour test ultérieur)
	 * Pour l'activer, il suffit de décommenter @Bean
	 */
	//@Bean
	CommandLineRunner start(CustomerRepository customerRepository,
							BankAccountRepository bankAccountRepository,
							AccountOperationRepository accountOperationRepository) {
		return args -> {
			Stream.of("Wissal", "Younes", "Fatima").forEach(name -> {
				Customer customer = new Customer();
				customer.setName(name);
				customer.setEmail(name + "@gmail.com");
				customerRepository.save(customer);
			});

			customerRepository.findAll().forEach(cust -> {
				CurrentAccount currentAccount = new CurrentAccount();
				currentAccount.setId(UUID.randomUUID().toString());
				currentAccount.setBalance(Math.random() * 90000);
				currentAccount.setCreatedAt(new Date());
				currentAccount.setStatus(AccountStatus.CREATED);
				currentAccount.setCustomer(cust);
				currentAccount.setOverDraft(9000);
				bankAccountRepository.save(currentAccount);

				SavingAccount savingAccount = new SavingAccount();
				savingAccount.setId(UUID.randomUUID().toString());
				savingAccount.setBalance(Math.random() * 90000);
				savingAccount.setCreatedAt(new Date());
				savingAccount.setStatus(AccountStatus.CREATED);
				savingAccount.setCustomer(cust);
				savingAccount.setInterestRate(5.5);
				bankAccountRepository.save(savingAccount);
			});

			bankAccountRepository.findAll().forEach(acc -> {
				for (int i = 0; i < 10; i++) {
					AccountOperation accountOperation = new AccountOperation();
					accountOperation.setOperationDate(new Date());
					accountOperation.setAmount(Math.random() * 12000);
					accountOperation.setType(Math.random() > 0.5 ? OperationType.DEBIT : OperationType.CREDIT);
					accountOperation.setBankAccount(acc);
					accountOperationRepository.save(accountOperation);
				}

				System.out.println("***************");
				System.out.println("Account ID: " + acc.getId());
				System.out.println("Balance: " + acc.getBalance());
				System.out.println("Status: " + acc.getStatus());
				System.out.println("Customer: " + acc.getCustomer().getName());
				System.out.println("Type: " + acc.getClass().getSimpleName());

				if (acc instanceof CurrentAccount) {
					System.out.println("Over Draft => " + ((CurrentAccount) acc).getOverDraft());
				} else if (acc instanceof SavingAccount) {
					System.out.println("Rate => " + ((SavingAccount) acc).getInterestRate());
				}

				acc.getAccountOperations().forEach(op -> {
					System.out.println(op.getType() + "\t" + op.getOperationDate() + "\t" + op.getAmount());
				});
			});
		};
	}
}