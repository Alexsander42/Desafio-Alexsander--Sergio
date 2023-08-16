import cardapio from "./cardapio"

class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {

        var subTotal = 0.0

        try {

            // validações gerais
            this.validaMetodoDePagamento(metodoDePagamento)
            this.validaCarrinho(itens)

            itens.forEach(item => {

                // validações específicas do item
                this.validaItem(item)
                
                const codigo = item.split(',')[0]
                const quantidade = Number(item.split(',')[1])

                // validação específica para item extra
                this.validaExtra(codigo, itens)
    
                var precoUnitario = this.obterPrecoUnitario(codigo)
                subTotal += quantidade * precoUnitario
            })
            
            return this.calculaEMostraTotal(subTotal, metodoDePagamento)

        } catch (e) {
            return e.message
        }
    }

    validaMetodoDePagamento(metodoDePagamento) {
        if (!['debito', 'credito', 'dinheiro'].includes(metodoDePagamento)) {
            throw new Error('Forma de pagamento inválida!')
        }
    }

    validaCarrinho(itens) {
        if (itens.length === 0) {
            throw new Error('Não há itens no carrinho de compra!')
        }
    }

    validaItem(item) {

        if (item.split(',').length < 2) {
            throw new Error('Item inválido!')
        }

        if (Number(item.split(',')[1]) <= 0) {
            throw new Error('Quantidade inválida!')
        }

        const codigos = cardapio.map(itemCardapio => itemCardapio.codigo)
        if (!codigos.includes(item.split(',')[0])) {
            throw new Error('Item inválido!')
        }

    }

    validaExtra(codigo, itens) {
        const produto = this.buscarProdutoPorCodigo(codigo)
        const itensNome = itens.map(i => i.split(',')[0])
        if (produto.principal !== null) {
            if (!itensNome.includes(produto.principal)) {
                throw new Error('Item extra não pode ser pedido sem o principal')
            }
        }
    }

    buscarProdutoPorCodigo(codigo) {
        for (var i = 0; i < cardapio.length; i++) {
            if (cardapio[i].codigo === codigo) {
                return cardapio[i]
            }
        }
    }

    obterPrecoUnitario(codigo) {
        console.log(codigo)
        var precoUnitario = null
        cardapio.forEach(element => {
            if (element.codigo === codigo) {
                precoUnitario = element.valor
            }
        })
        if (precoUnitario === null) {
            throw new Error('Item inválido')
        }
        return precoUnitario
    }

    calculaEMostraTotal(subTotal, metodoDePagamento) {
        if (metodoDePagamento === 'dinheiro') {
            subTotal = subTotal * 0.95
        }

        if (metodoDePagamento === 'credito') {
            subTotal = subTotal * 1.03
        }

        return `R$ ${subTotal.toFixed(2)}`.replace('.', ',');
    }

}

export { CaixaDaLanchonete };
