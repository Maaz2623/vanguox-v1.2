"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";
import { CodeBlock, CodeBlockCopyButton } from "./code-block";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      components={{
        pre: ({ node, className, children }) => {
          let language = "javascript";

          if (typeof node?.properties?.className === "string") {
            language = node.properties.className.replace("language-", "");
          }

          let codeString = "";

          // ✅ If children is a valid React element with props
          if (
            typeof children === "object" &&
            children !== null &&
            "props" in children
          ) {
            const c = children as { props: { children: string | string[] } };
            codeString = Array.isArray(c.props.children)
              ? c.props.children.join("")
              : String(c.props.children);
          } else {
            // ✅ fallback: raw string, number, etc.
            codeString = String(children ?? "");
          }

          return (
            <CodeBlock
              className={cn("my-4 h-auto w-[40vw] overflow-x-auto", className)}
              code={codeString}
              language={language}
            >
              <CodeBlockCopyButton
                onCopy={() => console.log("Copied code to clipboard")}
                onError={() =>
                  console.error("Failed to copy code to clipboard")
                }
              />
            </CodeBlock>
          );
        },
      }}
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
