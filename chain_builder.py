import gzip
import io
import json
import os
import random
import time

import requests
import requests_cache


requests_cache.install_cache()

request = requests.get('https://rpg.rigden.us/seeds_of_infinity/resources/json/names.json')
NAMES = request.json()['data']

HOME_PATH = os.path.dirname(os.path.realpath(__file__))
JSON_PATH = os.path.join(HOME_PATH, "json")

def json_formatter(data, title):
    data_dict = {}
    data_dict['meta'] = {}
    data_dict['meta']['author'] = "Jason Rigden"
    data_dict['meta']['generator'] = "https://github.com/jrigden/Seeds_of_Infinity"
    data_dict['meta']['license'] = "http://unlicense.org"
    #data_dict['meta']['time_created'] = int(time.time())
    data_dict['meta']['title'] = title
    data_dict['data'] = data
    data_json = json.dumps(data_dict, ensure_ascii=False, indent=4, separators=(',', ': '))
    return data_json

def save_json(data, filename, title):
    file_path = os.path.join(JSON_PATH, filename)
    file_gz_path = os.path.join(JSON_PATH, filename + ".gz")
    data_json = json_formatter(data, title)
    with io.open(file_path, 'w', encoding='utf-8') as f:
        f.write(data_json)
    f_in = open(file_path, 'rb')
    f_out = gzip.open(file_gz_path, 'w')
    f_out.writelines(f_in)
    f_out.close()
    f_in.close()


class Chain(object):
    def __init__(self):
        self.chain = {}

    def build_link(self, current_item, next_item):
        if not current_item in self.chain:
            self.chain[current_item] = []
        self.chain[current_item].append(next_item)

    def generate_item(self, current_item):
        item = random.choice(self.chain[current_item])
        return item

    def generate_series(self):
        series_active = True
        series = []
        current_item = None
        while series_active:
            current_item = self.generate_item(current_item)
            if current_item is None:
                series_active = False
            else:
                series.append(current_item)
        return series



def build_one_letter_chain(list_of_words):
    chain = Chain()
    for word in list_of_words:
        chain.build_link(None, word[0])
        word_length = len(word)
        for i in range(word_length):
            try:
                chain.build_link(word[i], word[i+1])
            except IndexError:
                chain.build_link(word[i], None)
    return chain




def generate_first_name_json():
    first_names = []
    first_names.extend(NAMES['first_names']['feminine'])
    first_names.extend(NAMES['first_names']['masculine'])
    first_names = list(set(first_names))

    chain = build_one_letter_chain(first_names)
    save_json(chain.chain, "first_name_chain.json", "first_name_chain")

def generate_gendered_first_name_json(gender):
    first_names = NAMES['first_names'][gender]
    first_names = list(set(first_names))

    chain = build_one_letter_chain(first_names)
    title = gender + "_first_name_chain"
    save_json(chain.chain, title + ".json", title)

def generate_last_name_json():
    last_names = NAMES['last_names']
    last_names = list(set(last_names))

    chain = build_one_letter_chain(last_names)
    save_json(chain.chain, "last_name_chain.json", "last_name_chain")


generate_first_name_json()
generate_gendered_first_name_json('feminine')
generate_gendered_first_name_json('masculine')
generate_last_name_json()
