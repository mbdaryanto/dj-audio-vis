from pathlib import Path
from django.core.management.utils import get_random_secret_key

env_file = Path(__file__).parent / '.env'


def make_env():
    with env_file.open('w') as f:
        f.write('SECRET_KEY = {!r}\n'.format(get_random_secret_key()))
        f.write('DB_HOST = {!r}\n'.format(input('DB host : ')))
        f.write('DB_PORT = {!r}\n'.format(input('DB port : ')))
        f.write('DB_DATABASE = {!r}\n'.format(input('DB database : ')))
        f.write('DB_USER = {!r}\n'.format(input('DB user : ')))
        f.write('DB_PASSWORD = {!r}\n'.format(input('DB password : ')))


if __name__ == '__main__':
    make_env()
