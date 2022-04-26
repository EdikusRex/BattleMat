from kivy.app import App
# kivy.require("1.8.0")
from kivy.lang import Builder

from kivy.uix.floatlayout import FloatLayout
from kivy.uix.button import Button
from kivy.uix.image import Image
from kivy.uix.behaviors import DragBehavior
from kivy.uix.widget import Widget
from kivy.uix.slider import Slider
from kivy.graphics import *
from kivy.config import Config
import os

map_path = "Assets/Maps"
creature_path = "Assets/Creatures"
selected = None


class Creature(DragBehavior, Image):
    def on_touch_down(self, touch):
        if self.collide_point(*touch.pos):
            global selected
            app = App.get_running_app()

            selected = self
            app.root.ids.scaler.value = selected.size[0]

        return super().on_touch_down(touch)


class Map(Image):
    pass


class Scaler(Slider):
    def rescale(self, *args):
        if (selected):
            selected.size = (args[1], args[1])

    def collide_point(self, x, y):
        return self.x+30 <= x <= self.right-30 and self.y <= y <= self.top


class MapSelector(FloatLayout):
    def show_maps(self):
        app = App.get_running_app()
        menu = app.root.ids.map_menu

        if len(menu.children):
            menu.clear_widgets()
            return

        for map in os.listdir(map_path):
            btn = Button(width=120, size_hint=(
                None, None), background_normal=f"{map_path}/{map}")
            btn.bind(on_press=self.change_bg)
            menu.add_widget(btn)

    def change_bg(self, instance):
        app = App.get_running_app()
        if app.root.ids.map.source == instance.background_normal:
            app.root.ids.map.source = "Assets/blank.jpg"
        else:
            app.root.ids.map.source = instance.background_normal


class CreatureSelector(FloatLayout):
    def show_creatures(self):
        app = App.get_running_app()
        menu = app.root.ids.creature_menu

        if len(menu.children):
            menu.clear_widgets()
            return

        for creature in os.listdir(creature_path):
            btn = Button(width=120, size_hint=(
                None, None), background_normal=f"{creature_path}/{creature}")
            btn.bind(on_press=self.spawn)
            menu.add_widget(btn)

    def spawn(self, instance):
        creature = Creature(source=instance.background_normal)
        self.add_widget(creature)

    def delete(self):
        self.remove_widget(selected)


class Painter(Widget):
    pen_color = (1, 1, 1)
    line_width = 3.0
    obj_bank = []
    redo_bank = []

    def on_touch_down(self, touch):
        # if 'button' not in touch.profile:
        #     return

        with self.canvas:
            touch.ud["line"] = Line(
                points=(touch.x, touch.y), width=self.line_width)
            self.obj_bank.append([touch.ud["line"], self.pen_color])

    def on_touch_move(self, touch):
        if "line" in touch.ud:
            touch.ud["line"].points += [touch.x, touch.y]

    def draw_color(self, color):
        if color == "White":
            self.pen_color = (1, 1, 1)
        elif color == "Red":
            self.pen_color = (1, 0, 0)
        elif color == "Green":
            self.pen_color = (0, 1, 0)
        elif color == "Blue":
            self.pen_color = (0, 0, 1)
        elif color == "Pink":
            self.pen_color = (0.8, 0, 0.8)
        elif color == "Eraser":
            self.canvas.clear()

        self.line_width = 3.0

        with self.canvas:
            Color(rgb=self.pen_color)

    def undo(self):
        if len(self.obj_bank):
            self.canvas.remove(self.obj_bank[-1][0])
            self.redo_bank.append(self.obj_bank[-1])
            self.obj_bank.pop(-1)

    def redo(self):
        temp_color = self.pen_color

        with self.canvas:
            if len(self.redo_bank):
                Color(rgb=self.redo_bank[-1][1])
                self.canvas.add(self.redo_bank[-1][0])
                self.obj_bank.append(self.redo_bank[-1])
                self.redo_bank.pop(-1)

            Color(rgb=temp_color)


class MainApp(App):
    def build(self):
        return Builder.load_file("Touch.kv")


if __name__ == "__main__":
    os.environ['KIVY_WINDOW'] = 'egl_rpi'
    Config.set('graphics', 'width', '1350')
    Config.set('graphics', 'height', '750')

    MainApp().run()
