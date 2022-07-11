from bs4 import BeautifulSoup
import os


def add_option(soup, acc, path):
    for item in os.listdir(path):
        if not os.path.isfile(os.path.join(path, item)):
            continue

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

    # for panel in soup.find_all(attrs={"class": "panel"}):
    #     panel.extract()

    creature_path = "Assets/Creatures"
    player_path = "Assets/Creatures/Players"
    creatures = soup.find(id="creatures")

    map_path = "Assets/Maps"
    grid_path = "Assets/Maps/Grid"
    maps = soup.find(id="maps")

    aoe_path = "Assets/Misc/AoE"
    aoe = soup.find(id="aoe")

    add_option(soup, creatures, creature_path)
    add_option(soup, creatures, player_path)
    add_option(soup, maps, map_path)
    add_option(soup, maps, grid_path)
    add_option(soup, aoe, aoe_path)

    f = open("index.html", "w")
    f.write(soup.prettify())
    f.close()


if __name__ == "__main__":
    main()
