from typing import Mapping
from bs4 import BeautifulSoup
import os


def add_option(soup, acc, path):
    button_text = acc.string
    acc.clear()
    acc.string = button_text

    for item in os.listdir(path):
        item = item.replace("'", "\\'").replace(" ", "\ ")

        panel = soup.new_tag("div", attrs={"class": "panel"})
        option = soup.new_tag("button", attrs={
            "class": "option", "style": f"background-image: url({path}/{item})"})

        panel.append(option)
        acc.insert_after(panel)


def main():
    f = open("template.html")
    soup = BeautifulSoup(f, "html.parser")
    f.close()

    map_path = "Assets/Maps"
    creature_path = "Assets/Creatures"
    creatures = soup.find(id="creatures")
    maps = soup.find(id="maps")

    add_option(soup, creatures, creature_path)
    add_option(soup, maps, map_path)

    f = open("index.html", "w")
    f.write(soup.prettify())
    f.close()


if __name__ == "__main__":
    main()
