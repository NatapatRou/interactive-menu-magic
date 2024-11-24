FROM php:8.2-apache
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
RUN docker-php-ext-install pdo pdo_mysql
RUN apt-get update && apt-get upgrade -y 
# RUN python3 -m venv /opt/venv
# RUN /opt/venv/bin/pip install mysql-connector-python sqlalchemy
# ENV PATH="/opt/venv/bin:$PATH"
# RUN pip install mysql-connector-python sqlalchemy
# RUN pip3 install mysql-connector-python sqlalchemy
