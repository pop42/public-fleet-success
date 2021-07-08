import ShortUniqueId from 'short-unique-id'

const suid = new ShortUniqueId({ length: 12 })

export class Utils {
  public static suid = () => suid() as string
}
