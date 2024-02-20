import { Streamlit, StreamlitComponentBase, withStreamlitConnection } from "streamlit-component-lib";
import React, { ReactNode } from "react";

interface State {
  inputValue: string;
  fontSize: string;
  value: string;
  disabled: boolean;
  factor: number;
}

class DynamicFontSizeInput extends StreamlitComponentBase<{}, State> {
  public state = { inputValue: "", fontSize: "16px" };

  public render = (): ReactNode => {
    // check if value is passed in as a prop, if not use the input value
    const value = this.props.args["value"] || this.state.inputValue;

    // Calculate the font size based on the number of words in the input
    const factor = this.props.args["factor"] || 1;
    const wordCount = value.trim().split(/\s+/).length;
    const fontSize = DynamicFontSizeInput.dynamicClamp(wordCount, factor);

    // Calculate the height based on the content
    const height = this.calculateHeight(Number(fontSize.split('px')[0]), wordCount);

    // case for input portion
    let return_input = (
      <textarea
        value={value}
        onChange={this.onInputChange}
        style={{ fontSize, width: "100%", padding: "10px", height: height, resize: "none", overflow: "hidden"}}
      />
    );

    // case for result portion
    let return_no_input = (
      <div style={{ fontSize, width: "100%", padding: "10px", height: height, resize: "none", overflow: "hidden"}}>
        {value}
      </div>
    );

    let return_div;

    // check props for disabled
    if (this.props.args["disabled"]) {
      return_div = return_no_input;
    } else {
      return_div = return_input;
    }

    // return case
    return <div style={{ width: "100%" }}>{return_div}</div>;
  };

  private static dynamicClamp = (wordCount: number, fctr: number): string => {
    const factor = fctr;
    const size = Math.max(Math.exp(wordCount / -12) * factor ** 2, 24);
    return `${size}px`;
  };

  private calculateHeight = (font_size: number, words: number): string => {
    // Here you would implement your logic to calculate the height based on the content
    // For example, you could count the number of line breaks and adjust the height accordingly
    const lines = Math.ceil(words / 12);
    font_size = font_size || 16;
    const height = lines * font_size * 1.8 + 5;
    return `${height}px`;
  };

  private onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const inputValue = event.target.value;
    this.setState({ inputValue }, () => {
      // Stream the input value back to Streamlit
      Streamlit.setComponentValue(inputValue);
    });
  };
}

export default withStreamlitConnection(DynamicFontSizeInput);
