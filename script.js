const Modal = {
	toggle() {
		document
			.querySelector('.modal-overlay')
			.classList
			.toggle('active')
	}
}

const Utils = {
	formatAmount(value) {
		
		value = value * 100

		return Math.round(value)
	},

	formatDate(value) {
		const dateArray = value.split('-')

		return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`
	},

	formatCurrency(value) {
		// Put '-' signal if the value is negative
		const signal = Number(value) < 0 ? '-' : ''

		// Remove all values that are not numbers
		value = String(value).replace(/\D/g, '')

		value = Number(value) / 100

		// Format to BRL currency
		value = value.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		})

		return signal + value
	}
}

const Balance = {
	incomes() {
		let income = 0
		transactions.forEach(transaction => {
			if (transaction.amount > 0) {
				income += transaction.amount
			}
		})
		return income
	},

	expenses() {
		let expense = 0
		transactions.forEach(transaction => {
			if (transaction.amount < 0) {
				expense += transaction.amount
			}
		})
		return expense
	}, 

	total() {
		return Balance.incomes() + Balance.expenses()
	}
}

function updateBalance() {
	document
		.getElementById('income-display')
		.innerHTML = Utils.formatCurrency(Balance.incomes())
	document
		.getElementById('expense-display')
		.innerHTML = Utils.formatCurrency(Balance.expenses())
	document
		.getElementById('total-display')
		.innerHTML = Utils.formatCurrency(Balance.total())
}

const Storage = {
	set() {

		return localStorage.setItem('transactions', JSON.stringify(transactions))
	},

	get() {
		return JSON.parse(localStorage.getItem('transactions')) || []
	}
}

const transactions = Storage.get()


const Form = {

	formatValues() {
		return {

			amount: Utils.formatAmount(document.querySelector('input#amount').value),
			date: Utils.formatDate(document.querySelector('input#date').value)
		
		}
	},

	getValues() {
		const {amount, date} = Form.formatValues()

		return {
			description: document.querySelector('input#description').value,
			amount,
			date
		}
	},

	submit(event) {
		event.preventDefault()

		const {description, amount, date} = Form.getValues()

		// Validate input fields
		if (document.querySelector('input#description').value === '' ||
			document.querySelector('input#amount').value === '' ||
			document.querySelector('input#date').value === '') return alert('Preencha todos os campos')

		const data = {
			description,
			amount,
			date
		}	
	 
		Transaction.set(data)

		// Clean input fields
		document.querySelector('input#description').value = ''
		document.querySelector('input#amount').value = ''
		document.querySelector('input#date').value = ''
	}
}



const Transaction = {
	// Set transaction
	set(value) {
		transactions.push(value)

		Storage.set()

		Transaction.display()
		Modal.toggle()
	},

	remove(index) {
		transactions.splice(index, 1)

		Storage.set()

		Transaction.display()
	},

	// Update transactions
	display() {

		const tbody = document.getElementById('transactions-container')

		// Cleanup to not show duplicates
		tbody.innerHTML = ''
		
		transactions.forEach((value, index) => {
			const tr = document.createElement('tr')


			const amountClass = value.amount > 0 ? 'income' : 'expense'

			const amount = Utils.formatCurrency(value.amount)

			tr.innerHTML = `
				<td class="description">${value.description}</td>
                <td class=${amountClass}>${amount}</td>
                <td>${value.date}</td>

                <td>
                    <img src="./assets/minus.svg" alt="Remover Transação"
                    	style='cursor:pointer'
                    	onclick='Transaction.remove(${index})'
                    >
                </td>
			`

			tbody.appendChild(tr) 
		})

		updateBalance()
	}
}

Transaction.display()


