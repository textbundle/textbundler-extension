## Complex Table Example

This article contains a complex HTML table with various features that should be preserved as inline HTML in the Markdown output.

<table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Chrome</th>
          <th>Firefox</th>
          <th>Safari</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Manifest V3</td>
          <td>Yes</td>
          <td>Yes</td>
          <td>Yes</td>
        </tr>
        <tr>
          <td colspan="2">Service Workers</td>
          <td>Event Pages</td>
          <td>Both</td>
        </tr>
        <tr>
          <td>Storage API</td>
          <td rowspan="2">Full Support</td>
          <td>Full Support</td>
          <td>Partial</td>
        </tr>
        <tr>
          <td>Downloads API</td>
          <td>Full Support</td>
          <td>Limited</td>
        </tr>
      </tbody>
    </table>

The table above demonstrates thead, tbody, colspan, and rowspan attributes. These should be preserved in the output since GFM tables cannot represent merged cells.
