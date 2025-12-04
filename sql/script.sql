create table hd_estoque.material (
	id serial primary key,
	nome varchar(255) unique not null,
	descricao text
);

create table hd_estoque.cor (
	id serial primary key,
	nome varchar(255) unique not null,
	descricao text
);

create table hd_estoque.categoria (
	id serial primary key,
	nome varchar(255) unique not null,
	descricao text
);

create table hd_estoque.colecao (
	id serial primary key,
	nome varchar(255) unique not null,
	descricao text
);

create table hd_estoque.produto (
	id serial primary key,
	nome varchar(255) unique not null,
	id_material int not null,
	id_cor int not null,
	id_categoria int not null,
	id_colecao int,
	preco NUMERIC(5, 2),
	gasto_material_metro numeric(5,2),
	
	constraint fk_material foreign key (id_material) references hd_estoque.material(id),
	constraint fk_cor foreign key (id_cor) references hd_estoque.cor(id),
	constraint fk_categoria foreign key (id_categoria) references hd_estoque.categoria(id),
	constraint fk_colecao foreign key (id_colecao) references hd_estoque.colecao(id)
);

create table hd_estoque.local_armazenamento (
	id serial primary key,
	nome varchar(255) unique not null,
	descricao text
);

create table hd_estoque.produto_local_armazenamento (
	id serial primary key,
	id_produto int not null,
	id_local_armazenamento int not null,
	metros_em_estoque NUMERIC(5, 2) not null default 0.00,
	
	constraint fk_produto foreign key (id_produto) references hd_estoque.produto(id),
	constraint fk_local_armazenamento foreign key (id_local_armazenamento) references hd_estoque.local_armazenamento(id)
);

drop table hd_estoque.produto_local_armazenamento;
drop table hd_estoque.local_armazenamento;
drop table hd_estoque.produto;
drop table hd_estoque.colecao;
drop table hd_estoque.categoria;
drop table hd_estoque.cor;
drop table hd_estoque.material;