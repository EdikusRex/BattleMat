from bs4 import BeautifulSoup, element
import os


def add_option(soup, acc, path):
    for item in os.listdir(path):
        if not os.path.isfile(os.path.join(path, item)):
            continue

        item = item.replace("'", "\\'").replace(" ", "\ ") \
            .replace("(", "\\(").replace(")", "\\)")
        panel = soup.new_tag("div", attrs={"class": "panel"})
        option = soup.new_tag("button", attrs={
            "class": "option", "style": f"background-image: url(../../{path}/{item})"})

        panel.append(option)

        for c in acc.next_elements:
            if type(c) == element.Tag and "panelContainer" in c["class"]:
                c.append(panel)
                break


def main():
    f = open("src/html/template.html")
    soup = BeautifulSoup(f, "html.parser")
    f.close()

    creature_path = "Assets/Creatures"
    player_path = "Assets/Creatures/Players"
    creatures_acc = soup.find(id="creatures")

    map_path = "Assets/Maps"
    grid_path = "Assets/Maps/Grid"
    maps_acc = soup.find(id="maps")

    aoe_path = "Assets/Misc/AoE"
    aoe_acc = soup.find(id="aoe")

    add_option(soup, creatures_acc, player_path)
    add_option(soup, creatures_acc, creature_path)
    add_option(soup, maps_acc, grid_path)
    add_option(soup, maps_acc, map_path)
    add_option(soup, aoe_acc, aoe_path)

    f = open("src/html/index.html", "w")
    f.write(soup.prettify())
    f.close()


if __name__ == "__main__":
    main()
