import sys
import hashlib
import json
from pathlib import Path


def update_appcast(version, desc):
    release_file = Path(f'release/chenhaohu-timestamp-to-time-{version}.bobplugin')
    assert release_file.is_file(), 'Release file not exist'
    with open(release_file, 'rb') as f:
        c = f.read()
        file_hash = hashlib.sha256(c).hexdigest()
    version_info = {
        'version': version,
        'desc': desc,
        'sha256': file_hash,
        'url': f'https://github.com/ChenHaoHu/bob-plugin-timestamp-to-time/releases/download/v{version}/{release_file.name}',
        'minBobVersion': '0.5.0'
    }
    appcast_file = Path('appcast.json')
    if appcast_file.is_file():
        with open(appcast_file, 'r') as f:
            appcast = json.load(f)
    else:
        appcast = dict(identifier='chenhaohu.timestamp.to.time', versions=[])
    appcast['versions'].insert(0, version_info)
    with open(appcast_file, 'w') as f:
        json.dump(appcast, f, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    version = sys.argv[1]
    desc = sys.argv[2]
    update_appcast(version, desc)
