const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { Knex } = require('knex');
const knex = require('./database/database');
const base64 = require('base-64');
const path = require('path');
const cors = require('cors');

const router = express.Router();


require('dotenv').config();
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));



router.get ('/clientes/:uid_usuario', async (req,res)=>{
	const { uid_usuario } = req.params;
	try{
		
		const usuario = await knex('tb_usuario').where({ uid_usuario }).select().first();

        if (!usuario) {
            return res.status(404).send('Usuário não encontrado');
        }

        const { id_empresa, descricao: nome_user } = usuario;
		
		const clientes = await knex('tb_cliente')
		.select('tb_cliente.id_cliente','tb_cliente.nome','tb_cliente.email','tb_cliente.endereco_celular','tb_cliente.endereco_telefone','tb_cliente.cpf_cnpj');
		
		res.render('listaClientes',{
			clientes,
			uid_usuario,
			nome_user
		})
		/*res.render('clientesnovo',{
			clientes,
			uid_usuario,
			nome_user
		})*/
		
	}catch(error){
		console.log(error)
		
	}
	
})

router.get ('/motos/:uid_usuario/:id', async (req,res)=>{
	const { uid_usuario, id } = req.params;

	const clientes = await knex('tb_cliente').where({id_cliente: id}).select();
	console.log(clientes[0].nome)
	
	const motos = await knex('tb_motos').where({id_cliente: id}).select();
	//console.log(moto)
	
	res.render('motos', {
		uid_usuario,
		id_empresa :1,
		participante: clientes,
		motos,
		id_cliente: clientes[0].id_cliente,
		nomeCliente: clientes[0].nome
	})
})


router.get ('/clienteEditar/:uid_usuario/:id', async (req,res)=>{
	const { uid_usuario, id } = req.params;

	const clientes = await knex('tb_cliente').where({id_cliente: id}).select();
	console.log(clientes)
	
	const motos = await knex('tb_motos').where({id_cliente: id}).select();
	//console.log(moto)
	
	res.render('editarCliente', {
		uid_usuario,
		id_empresa :1,
		participante: clientes,
		motos,
		id_cliente: clientes[0].id_cliente,
		nomeCliente : clientes[0].nome,
	})
})


router.post ('/clienteEditar', (req,res)=>{
	
	const { uid_usuario, id_cliente, nome,email,cpf_cnpj,data_nascimento,telefone,celular,cep,endereco,bairro,cidade,uf,numero,complemento,placa_moto,modelo_moto,ano_moto,observacao } = req.body;
	
	try{
		knex('tb_cliente').where({id_cliente}).update({
			nome: nome === '' ? null: nome,
			email: email === '' ? null: email,
			cpf_cnpj: cpf_cnpj === '' ? null: cpf_cnpj,
			//rg: rg === '' ? null: rg,
			data_nascimento: data_nascimento === '' ? null: data_nascimento,
			endereco_cep: cep === '' ? null: cep,
			endereco_rua: endereco === '' ? null: endereco,
			endereco_numero: numero === '' ? null: numero,
			endereco_complemento: complemento === '' ? null: complemento,
			endereco_bairro: bairro === '' ? null: bairro,
			endereco_cidade: cidade === '' ? null: cidade,
			endereco_uf: uf === '' ? null: uf,
			endereco_telefone: telefone === '' ? null: telefone,
			endereco_celular: celular === '' ? null: celular,
			observacao: observacao === '' ? null: observacao
			
			
		}).then(result=>{
			console.log('Cliente Atualizado com sucesso');
			res.send('Cliente Atualizado com sucesso')
		})
	}
	catch(error){
		console.log(error)
		res.redirect('/clienteEditar/'+uid_usuario+'/'+id_cliente)
	}
	
})




router.get('/clientes_excluir/:id/:uid_usuario', async (req,res)=>{
	const { id, uid_usuario } = req.params;
	
	console.log(id)
	console.log(uid_usuario)
	
	
	
	try{
		const delClientes = await knex('tb_cliente').where ({id_cliente: id}).del();
		console.log(delClientes)
		
		res.status(200).send('Exclusão Relizada com Sucesso');
		
	}catch(error){
		console.log(error)
		res.status(404).send(error);
	}
	
})


module.exports = router;