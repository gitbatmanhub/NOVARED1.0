use bddnova;

create table usuario
(
  iduser int(6) not null primary key auto_increment,
  username varchar(50) not null ,
  password varchar(60) not null ,
  fullname varchar(50) not null ,
  sobreMi varchar(200),
  empresa varchar(50) not null default 'Novared',
  pais varchar(50),
  direccion varchar(100),
  telefono int(10),
  igLink varchar(30),
  twitterLink varchar(30),
  inkedInLink varchar(30),
  rolusuario int(4)
);

alter table usuario auto_increment=1;


create table rolUsuario
(
  idRol int(4) not null primary key auto_increment,
  nameRol varchar(50)
);

alter table rolUsuario auto_increment=1;

create table ordenTrabajo
(
    idOrdenTrabajo int(7) not null primary key auto_increment,
    descripcion varchar(1000) not null,
    create_at timestamp default current_timestamp,
    estadoMaquina int(4) not null,
    idUsuario int(6) not null,
    idPrioridad int(3) not null,
     idArea int(3) not null,
    idMaquina int(3) not null,
    idStatus int(3) not null
);


alter table ordenTrabajo auto_increment=1;


create table prioridad
(
    idPrioridad int(3) not null auto_increment primary key,
    namePrioridad varchar(50) not null
);

alter table prioridad auto_increment =1;

create table area
(
    idArea int(3) not null primary key auto_increment,
    nameArea varchar(50) not null
);

alter table area auto_increment=1;

create table maquina
(
    idMaquina int(3) not null primary key auto_increment,
    nameMaquina varchar(30) not null,
    idArea int(3) not null
);



alter table maquina auto_increment=1;



create table estadoMaquina
(
    idEstadoMaquina int(3) not null primary key auto_increment,
    nameEstado varchar(50) not null
);

alter table estadoMaquina auto_increment=1;



create table tecnico
(
  idTecnico int(6) not null auto_increment primary key,
  idUser int(6) not null,
  idEspecialidad int(6) not null
);

alter table tecnico auto_increment=1;


create table especialidadtecnico
(
    idEspecialidad int(3) not null primary key auto_increment,
    nameEspecialidad varchar(30) not null

);

alter table especialidadtecnico auto_increment=1;

create table orden_Trabajador
(
    idOrdenTrabajador int(7) not null primary key auto_increment,
    idOrden int(7) not null ,
    idTecnico int(6) not null ,
    create_at timestamp default current_timestamp
);

alter table orden_Trabajador auto_increment=1;

create table orden_Producto
(
    idOrdenProducto int(7) not null auto_increment primary key,
    idOrden int(7) not null,
    idProducto int(7) not null,
    create_at timestamp default current_timestamp
);
alter table orden_Producto auto_increment=1;


create table orden_Status
(
    idOrdenStatus int(7) not null auto_increment primary key ,
    idStatus int(3) not null,
    idOrden int(7) not null ,
    idTipoMantenimiento int(3) not null,
    create_at timestamp default current_timestamp

);

alter table orden_Status auto_increment=1;


create table tipoMantenimiento
(
    idTipoMantenimiento int(3) not null auto_increment primary key,
    nameTipoMantenimiento varchar(50) not null
);

create table status
(
    idStatus int(3) not null auto_increment primary key ,
    nameStatus varchar(50) not null ,
    avanceStatus int(2) not null
);

create table maquina_Area
(
    idMaquinaArea int(3) primary key auto_increment not null,
    idArea int(3) not null,
    idMaquina int(3) not null
);

alter table maquina_Area auto_increment=1;


create table producto
(
    idProducto int(6) not null primary key auto_increment,
    nameProducto varchar(50) not null,
    cantidadProducto int(6) not null ,
    datosAdicionales varchar(200)
);

alter table producto auto_increment=1;

/*
DROP TABLE area;
DROP TABLE especialidadtecnico;
DROP TABLE estadoMaquina;
DROP TABLE maquina;
DROP TABLE orden_Producto;
DROP TABLE orden_status;
DROP TABLE orden_Trabajador;
DROP TABLE ordentrabajo;
DROP TABLE prioridad;
DROP TABLE rolusuario;
DROP TABLE status;
drop table tecnicos;
drop table tipomantenimiento;

*/

show tables;


alter table usuario
add constraint fk_RolUsuario foreign key (rolusuario) references rolusuario(idRol);

alter table ordentrabajo
add constraint fk_idUsuario foreign key (idUsuario) references usuario(iduser);

alter table ordentrabajo
add constraint fk_idPrioridad foreign key (idPrioridad) references prioridad(idPrioridad);

alter table ordentrabajo
add constraint fk_estadoMaquina foreign key (estadoMaquina) references estadoMaquina(idEstadoMaquina);

alter table ordenTrabajo
add constraint fk_idstatusOT foreign key (idStatus) references status(idStatus);

alter table ordenTrabajo
    add constraint fk_idMaquina foreign key (idMaquina) references maquina(idMaquina);

alter table ordenTrabajo
    add constraint fk_idArea foreign key (idArea) references area(idArea);

alter table orden_status
add constraint fk_idOrden foreign key (idOrden) references ordentrabajo(idOrdenTrabajo);

alter table  orden_status
add constraint fk_idTipoMantenimiento foreign key (idTipoMantenimiento) references tipomantenimiento(idTipoMantenimiento);

alter table orden_Status
add constraint fk_idStatusOs foreign key (idStatus) references status(idStatus);

alter table orden_producto
add constraint fk_idProducto foreign key (idProducto) references producto(idProducto);

alter table orden_producto
add constraint fk_id_Orden foreign key (idOrden) references ordenTrabajo(idOrdenTrabajo);

alter table orden_Trabajador
add constraint fk_idOrdenT foreign key (idOrden) references ordenTrabajo(idOrdenTrabajo);

alter table orden_Trabajador
add constraint fk_idTecnico foreign key (idTecnico) references tecnico(idTecnico);

alter table tecnico
add constraint fk_idUserT foreign key (idUser) references usuario(iduser);

alter table tecnico
add constraint fk_idespecialidad foreign key (idEspecialidad) references especialidadtecnico(idEspecialidad);

show tables ;


select * from usuario;

select * from rolusuario;

insert into rolusuario( nameRol)
values ('Administrador'),
        ('Lider Mantenimiento'),
        ('Usuario'),
        ('Tecnico');


update usuario set rolusuario=2 where iduser=2;
update usuario set rolusuario=4 where iduser=1;


select fullname, r.nameRol
from usuario
join bddnova.rolusuario r on usuario.rolusuario = r.idRol
where idRol=2;

select * from status;

insert into status(nameStatus, avanceStatus)
VALUES ('Abierta', 20),
       ('Aprobada',40 ),
       ('Atendida',60 ),
       ('En Progreso',70 ),
       ('Terminada', 100 );
select * from status;


select * from area;

insert into area(nameArea)
values ('Edificio'),
       ('Equipos Auxiliares'),
       ('Maquinas'),
       ('PTAR'),
       ('Garita'),
       ('Molinos'),
       ('Subestación'),
       ('Montacargas'),
       ('Compactadora');



insert into maquina(nameMaquina, idArea)
values ('Administrativo',1),
('Financiero',1),
('Producción',1),
('Logistica/BodegaPT',1),
('Compactadora',9),
('Compresor JAGUAR I',2),
('Compresor JAGUAR II',2),
('Pelletizadora 1',3),
('Pelletizadora 2',3),
('Pelletizadora 3',3),
('Lavado Film',3),
('PET',3),
('Lavado Hogar',3),
('Lavado Zuncho',3),
('Clasificadora de colores',3),
('PTAR',4),
('Garita',5),
('Puerta Garita',5),
('Zuncho',6),
('Hogar',6),
('Film',6),
('PET',6),
('Trituradora',6),
('Transformador Inatra 250 KVA',7),
('Transformador Inatra 750 KVA',7),
('Montacargas 1 - 2.5T',8),
('Montacargas 2 - 2.5T',8),
('Montacargas 3 - 3T',8),
('Montacargas 4 - 3T',8);



insert into especialidadtecnico(nameEspecialidad)
values ('Electricista'),
       ('Soldador'),
       ('Jefe'),
       ('Ayudante');



insert into prioridad(namePrioridad)
values ('Baja'),
       ('Media'),
       ('Alta');



insert into estadoMaquina(nameEstado)
values ('Operativa'),
       ('Parada');


select * from usuario;

select * from area;
select * from maquina;


insert into tipomantenimiento(nameTipoMantenimiento)
values ('Preventivo'),
       ('Correctivo'),
       ('Mejora');



alter table orden_Status
add column idUsuario int(6) not null;

alter table orden_Status
add constraint fk_idUsuarioStatus foreign key (idUsuario) references usuario(iduser);


/* ================================== */
create table probe1
(
    id int(1) auto_increment not null primary key,
    name varchar(19)
);

create table probe2
(
    id int(1) auto_increment not null primary key,
    name varchar(19)
);

select * from prioridad ;
select * from ordenTrabajo;
where idUsuario=2;

select * from rolusuario;

select * from ordenTrabajo where idUsuario=2;
select * from usuario;
select * from area;

select ordenTrabajo.idOrdenTrabajo,ordenTrabajo.descripcion, a.nameArea, m.nameMaquina,  e.nameEstado,  p.namePrioridad
from ordenTrabajo
inner join prioridad p on ordenTrabajo.idPrioridad = p.idPrioridad
inner join maquina m on ordenTrabajo.idMaquina = m.idMaquina
inner join area a on ordenTrabajo.idArea = a.idArea
inner join estadoMaquina e on ordenTrabajo.estadoMaquina = e.idEstadoMaquina
inner join ordentrabajo o on ordenTrabajo.idUsuario = o.idUsuario  and o.idUsuario=2;




select ordenTrabajo.idOrdenTrabajo, ordenTrabajo.descripcion, a.nameArea, m.nameMaquina,  e.nameEstado,  p.namePrioridad
from ordenTrabajo
    inner join prioridad p on ordenTrabajo.idPrioridad = p.idPrioridad
    inner join maquina m on ordenTrabajo.idMaquina = m.idMaquina
    inner join area a on ordenTrabajo.idArea = a.idArea
    inner join estadoMaquina e on ordenTrabajo.estadoMaquina = e.idEstadoMaquina
    inner join ordentrabajo o on ordenTrabajo.idUsuario = o.idUsuario  and o.idUsuario=2;

select * from ordenTrabajo;

select ordenTrabajo.idOrdenTrabajo, ordenTrabajo.descripcion, ordenTrabajo.create_at , a.nameArea, m.nameMaquina , e.nameEstado,  p.namePrioridad from ordenTrabajo inner join prioridad p on ordenTrabajo.idPrioridad = p.idPrioridad inner join maquina m on ordenTrabajo.idMaquina = m.idMaquina inner join area a on m.idArea = a.idArea inner join estadoMaquina e on ordenTrabajo.estadoMaquina = e.idEstadoMaquina inner join status s on ordenTrabajo.idStatus = s.idStatus where ordenTrabajo.idOrdenTrabajo=?;

select * from status;




select ordenTrabajo.idOrdenTrabajo, ordenTrabajo.descripcion, ordenTrabajo.create_at , a.nameArea, m.nameMaquina,  e.nameEstado,  p.namePrioridad from ordenTrabajo inner join prioridad p on ordenTrabajo.idPrioridad = p.idPrioridad inner join maquina m on ordenTrabajo.idMaquina = m.idMaquina inner join area a on m.idArea = a.idArea inner join estadoMaquina e on ordenTrabajo.estadoMaquina = e.idEstadoMaquina where ordenTrabajo.idOrdenTrabajo=?;
select * from ordenTrabajo;
select * from status;

select * from es;


select ordenTrabajo.idOrdenTrabajo,s.nameStatus, ordenTrabajo.descripcion, ordenTrabajo.create_at , a.nameArea, m.nameMaquina , e.nameEstado,  p.namePrioridad
from ordenTrabajo
    inner join prioridad p on ordenTrabajo.idPrioridad = p.idPrioridad
    inner join maquina m on ordenTrabajo.idMaquina = m.idMaquina
    inner join area a on m.idArea = a.idArea
    inner join estadoMaquina e on ordenTrabajo.estadoMaquina = e.idEstadoMaquina
    inner join status s on ordenTrabajo.idStatus = s.idStatus where ordenTrabajo.idOrdenTrabajo=7;


select * from ordenTrabajo;
select * from area;
select * from usuario;
select * from prioridad;
select * from estadoMaquina;
select ordenTrabajo.*, s.nameStatus, ordenTrabajo.descripcion, ordenTrabajo.create_at , a.nameArea, m.nameMaquina , e.nameEstado,  p.namePrioridad
from ordenTrabajo
    inner join prioridad p on ordenTrabajo.idPrioridad = p.idPrioridad
    inner join maquina m on ordenTrabajo.idMaquina = m.idMaquina
    inner join area a on ordenTrabajo.idArea=a.idArea
    inner join estadoMaquina e on ordenTrabajo.estadoMaquina = e.idEstadoMaquina
    inner join status s on ordenTrabajo.idStatus = s.idStatus
where ordenTrabajo.idStatus=1;


select * from area where idArea=7;


select ordenTrabajo.idOrdenTrabajo, ordenTrabajo.descripcion, ordenTrabajo.create_at , a.nameArea, m.nameMaquina,  e.nameEstado,  p.namePrioridad
from ordenTrabajo
    inner join prioridad p on ordenTrabajo.idPrioridad = p.idPrioridad
    inner join maquina m on ordenTrabajo.idMaquina = m.idMaquina
    inner join area a on m.idArea = a.idArea
    inner join estadoMaquina e on ordenTrabajo.estadoMaquina = e.idEstadoMaquina
    where ordenTrabajo.idStatus=1;


select * from tipomantenimiento;

select * from usuario;
select * from ordenTrabajo;
select * from status;
select * from orden_status;

select ordenTrabajo.*,s.avanceStatus, ordenTrabajo.descripcion, ordenTrabajo.create_at , a.nameArea, m.nameMaquina,  e.nameEstado,  p.namePrioridad
from ordenTrabajo
    inner join prioridad p on ordenTrabajo.idPrioridad = p.idPrioridad
    inner join maquina m on ordenTrabajo.idMaquina = m.idMaquina
    inner join area a on ordenTrabajo.idArea=a.idArea
    inner join estadoMaquina e on ordenTrabajo.estadoMaquina = e.idEstadoMaquina
    inner join status s on ordenTrabajo.idStatus = s.idStatus
where ordenTrabajo.idUsuario=2;

select * from usuario;
select * from rolusuario;

update usuario
set rolusuario=4 where iduser=4;

select * from usuario where rolusuario=4;
select * from especialidadtecnico;

select * from tecnico;
insert into tecnico( idUser, idEspecialidad)
values (1, 1),
       (3, 2),
       (4, 4);


select u.fullname, e.nameEspecialidad, u.iduser
from tecnico
    inner join usuario u on tecnico.idUser = u.iduser
    inner join especialidadtecnico e on tecnico.idEspecialidad = e.idEspecialidad;

select u.fullname, e.nameEspecialidad, u.iduser from tecnico inner join usuario u on tecnico.idUser = u.iduser inner join especialidadtecnico e on tecnico.idEspecialidad = e.idEspecialidad where e.idEspecialidad !=4;

select * from especialidadtecnico;

select * from usuario;
select * from ordentrabajo;
select ordenTrabajo.*, s.nameStatus, ordenTrabajo.descripcion, ordenTrabajo.create_at , a.nameArea, m.nameMaquina , e.nameEstado,  p.namePrioridad from ordenTrabajo inner join prioridad p on ordenTrabajo.idPrioridad = p.idPrioridad inner join maquina m on ordenTrabajo.idMaquina = m.idMaquina inner join area a on ordenTrabajo.idArea=a.idArea inner join estadoMaquina e on ordenTrabajo.estadoMaquina = e.idEstadoMaquina inner join status s on ordenTrabajo.idStatus = s.idStatus where ordenTrabajo.idOrdenTrabajo=7;
select * from orden_Trabajador;
describe orden_Trabajador;

select * from usuario;

select u.fullname, e.nameEspecialidad, u.iduser from tecnico inner join usuario u on tecnico.idUser = u.iduser inner join especialidadtecnico e on tecnico.idEspecialidad = e.idEspecialidad where e.idEspecialidad !=4;
use bddnova;


select * from tipomantenimiento;
