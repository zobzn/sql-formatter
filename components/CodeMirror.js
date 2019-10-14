import "codemirror/lib/codemirror.css";

import React from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/sql/sql";

export default props => <CodeMirror {...props} />;
