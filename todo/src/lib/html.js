import htm from "htm";
import { createElement } from "react";

// JSX 대신 쓰는 태그 템플릿: html`<div className=${cls}>...</div>`
// 컴포넌트는 <${Component} prop=${value} />, 닫는 태그는 <//> 로 쓴다.
export const html = htm.bind(createElement);
