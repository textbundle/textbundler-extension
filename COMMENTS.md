# Review Notes: TASK-004

## Observations Carried Forward

- non-article.html uses a redirect page with empty body instead of a login form. The spec describes it as "a login form or search results page with no identifiable article content," but Readability with linkedom extracts content from any page with text nodes in the body, even form-only pages. The redirect page satisfies the acceptance criterion (Readability returns null). This is documented in an HTML comment referencing DA-04. If future Readability or linkedom updates change this behavior, the fixture may need revisiting.
- mixed-content.html includes nav, sidebar aside, and footer elements outside the article tag, which will exercise Readability's content isolation in downstream tasks (TASK-009, TASK-021).
