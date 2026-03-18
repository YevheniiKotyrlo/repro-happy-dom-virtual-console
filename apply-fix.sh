#!/bin/bash
# Patches happy-dom's VirtualConsole.d.ts to remove `implements Console`
# and replace the ConsoleConstructor import with an indexed access type.
#
# This simulates the fix from:
#   - PR #2095 (merged): Replace ConsoleConstructor import
#   - PR #2102 (proposed): Remove `implements Console`

for dir in test-node test-bun test-deno; do
  FILE="$dir/node_modules/happy-dom/lib/console/VirtualConsole.d.ts"
  if [ -f "$FILE" ]; then
    # Remove the ConsoleConstructor import line
    sed -i '/import.*ConsoleConstructor/d' "$FILE"

    # Replace `class VirtualConsole implements Console` with `class VirtualConsole`
    sed -i 's/export default class VirtualConsole implements Console/export default class VirtualConsole/' "$FILE"

    # Replace `Console: ConsoleConstructor;` with indexed access type
    sed -i "s/Console: ConsoleConstructor;/Console: Console['Console'];/" "$FILE"

    echo "Patched $FILE"
  fi
done
