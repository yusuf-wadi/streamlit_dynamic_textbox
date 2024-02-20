import streamlit as st
from streamlit.components.v1 import declare_component
from __init__ import dynamic_textbox
# Declare the component
dynamic_font_size_input = declare_component("dynamic_textbox", url="http://localhost:3001")

# Use the component
user_input = dynamic_font_size_input(factor=8)

# Do something with the input
result = dynamic_font_size_input(value=user_input, disabled=True, factor=8)
