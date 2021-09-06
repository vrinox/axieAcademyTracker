# Axie Academy Tracker

## Tecnologias
    
    - Front:
        se utiliza Angular 12, Angular material

    - Back:
        servicios de firebase bd, loggin y con task

    - Control de versiones:
        Git, gitHub

## Acuerdos de trabajo

nunca trabajar directamente sobre la rama master del repo, al agregar alguna funcionabilidad se debe crear una rama apartir de master siguiendo el formato "[autor]-funcionabilidad"

ejemplo: "[victorLeon]-formulario_de_creacion_de_usuario"

los comandos que se utilizan crear una rama nueva:

```git
git fetch
git checkout master
git pull
git checkout -b [victorLeon]-formulario_de_creacion_de_usuario
```
y ya ahi tendrias tu rama para trabajar.

luego a la hora de subir los cambios a la rama principal(master) se hace una pullr request de tu rama a master desde github 