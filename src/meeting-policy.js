// A directory entry or an accessible page does not verify an invitation.
export function isPublishedFuture(record,today){return record.end>=today&&record.status==='published'&&record.primaryInvitation===true&&record.publicationPermission===true&&/^\d{4}-\d{2}-\d{2}$/.test(record.checkedAt||'')&&record.start<=record.end&&/^https:\/\//.test(record.url||'')}
