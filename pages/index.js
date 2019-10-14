import React, { useState } from "react";
import NextHead from "next/head";
import dynamic from "next/dynamic";
import { format } from "sql-formatter";

const CodeMirror = dynamic(() => import("../components/CodeMirror"), {
  ssr: false,
  loading: () => <p>Загрузка редактора…</p>
});

const startText = [
  "SELECT a.auser_id AS a__auser_id",
  "FROM auser a",
  "INNER JOIN auser_data a2 ON a.auser_id = a2.auser_id",
  "INNER JOIN auser_group a3 ON a.auser_id = a3.target_auser_id",
  "INNER JOIN auser_group_type a4 ON a3.auser_group_type_id = a4.id",
  "WHERE (a.name != 'noreg' AND a.is_published = '1' AND a3.is_published = '1' AND a3.is_visible = '1' AND a.is_published = '1' AND a4.name = 'union' AND a3.source_auser_id = '1016860')",
  "ORDER BY a.dt_register DESC, authenticity DESC, rating DESC"
].join(" ");

const options = {
  mode: "sql",
  tabSize: 4,
  indentUnit: 4,
  lineNumbers: false,
  lineWrapping: true
  // viewportMargin: Infinity
};

const SqlFormatter = () => {
  const [value, setValue] = useState(startText);

  return (
    <>
      <NextHead>
        <link rel="icon" href="/static/favicon.ico" importance="low" />
        <title>Форматирование SQL</title>
      </NextHead>
      <div className="wrapper">
        <div className="head">
          <div className="container--with-padding">
            <button
              type="button"
              onClick={e => setValue(format(value, { indent: "    " }))}
            >
              Форматировать SQL
            </button>
          </div>
        </div>
        <div className="body">
          <CodeMirror
            value={value}
            options={options}
            onBeforeChange={(editor, data, value) => {
              setValue(value);
            }}
            onChange={(editor, data, value) => {}}
          />
        </div>
      </div>
      <style global jsx>{`
        html,
        body {
          height: 100%;
          padding: 0;
          margin: 0;
        }
        #__next {
          height: 100%;
        }
        .react-codemirror2 {
          height: 100%;
          max-height: 100%;
        }
        .react-codemirror2 .CodeMirror {
          border-bottom: 1px solid #eee;
          border-top: 1px solid #eee;
          height: 100%;
        }
        .react-codemirror2 .CodeMirror-scroll {
          // overflow-y: hidden;
          // overflow-x: auto;
          // height: 100%;
        }
        .cm-tab {
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAMCAYAAAAkuj5RAAAAAXNSR0IArs4c6QAAAGFJREFUSMft1LsRQFAQheHPowAKoACx3IgEKtaEHujDjORSgWTH/ZOdnZOcM/sgk/kFFWY0qV8foQwS4MKBCS3qR6ixBJvElOobYAtivseIE120FaowJPN75GMu8j/LfMwNjh4HUpwg4LUAAAAASUVORK5CYII=);
          background-position: right;
          background-repeat: no-repeat;
        }
      `}</style>
      <style jsx>{`
        .wrapper {
          flex-direction: column;
          align-items: stretch;
          max-height: 100%;
          display: flex;
          height: 100%;
        }
        .head {
          padding: 2rem 0 0 0;
          flex: 0 0 auto;
        }
        .body {
          padding: 1rem 0 0 0;
          max-width: 1100px;
          overflow: hidden;
          margin: 0 auto;
          flex: 1 1 auto;
          width: 100%;
        }
        .container--with-padding {
          max-width: 1100px;
          padding: 0 1rem;
          margin: 0 auto;
        }
        .container--without-padding {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0;
        }
      `}</style>
    </>
  );
};

export default SqlFormatter;
