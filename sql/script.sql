create table material (
	id serial primary key,
	nome varchar(255) unique not null,
	descricao text
);

create table cor (
	id serial primary key,
	nome varchar(255) unique not null,
	descricao text
);

create table categoria (
	id serial primary key,
	nome varchar(255) unique not null,
	descricao text
);

create table colecao (
	id serial primary key,
	nome varchar(255) unique not null,
	descricao text
);

create table produto (
	id serial primary key,
	nome varchar(255) unique not null,
	id_material int not null,
	id_cor int not null,
	id_categoria int not null,
	id_colecao int,
	preco NUMERIC(5, 2),
	gasto_material_metro numeric(5,2),
	
	constraint fk_material foreign key (id_material) references material(id),
	constraint fk_cor foreign key (id_cor) references cor(id),
	constraint fk_categoria foreign key (id_categoria) references categoria(id),
	constraint fk_colecao foreign key (id_colecao) references colecao(id)
);

create table local_armazenamento (
	id serial primary key,
	nome varchar(255) unique not null,
	descricao text
);

create table produto_local_armazenamento (
	id serial primary key,
	id_produto int not null,
	id_local_armazenamento int not null,
	metros_em_estoque NUMERIC(5, 2) not null default 0.00,
	
	constraint fk_produto foreign key (id_produto) references produto(id),
	constraint fk_local_armazenamento foreign key (id_local_armazenamento) references local_armazenamento(id)
);

drop table produto_local_armazenamento;
drop table local_armazenamento;
drop table produto;
drop table colecao;
drop table categoria;
drop table cor;
drop table material;